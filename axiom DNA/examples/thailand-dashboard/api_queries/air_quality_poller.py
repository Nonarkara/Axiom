#!/usr/bin/env python3
"""
Axiom Framework - Air Quality API Poller
Polls Air4Thai and WAQI APIs and ingests data into PostgreSQL/TimescaleDB.
"""

import os
import sys
import json
import logging
import psycopg2
import requests
from datetime import datetime, timezone
from urllib.parse import urljoin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("air_quality_poller")

# Configuration
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://axiom:axiom@localhost:5432/municipal")
MUNICIPALITY_ID = os.environ.get("MUNICIPALITY_ID", "sikhio")
WAQI_TOKEN = os.environ.get("WAQI_TOKEN", "")
POLL_INTERVAL = int(os.environ.get("POLL_INTERVAL", "300"))

# Air4Thai endpoints
AIR4THAI_CURRENT = "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php"
AIR4THAI_HISTORY = "https://air4thai.pcd.go.th/services/getDataHistory.php"

# Station mapping: station_id -> (lat, lon, municipality_override)
STATION_OVERRIDES = {
    "03t": (14.892, 101.366, "sikhio"),        # Sikhio
    "43t": (6.551, 101.689, "yala_city"),       # Yala
    "80t": (8.432, 99.965, "nakhon_si"),        # Nakhon Si Thammarat
}


def get_db_connection():
    """Establish database connection."""
    return psycopg2.connect(DATABASE_URL)


def fetch_air4thai_current():
    """Fetch current air quality from all Air4Thai stations."""
    try:
        response = requests.get(AIR4THAI_CURRENT, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("stations", [])
    except requests.RequestException as e:
        logger.error(f"Failed to fetch Air4Thai data: {e}")
        return []


def fetch_waqi_station(station_name):
    """Fetch AQI from WAQI for a specific station."""
    if not WAQI_TOKEN:
        return None
    try:
        url = f"https://api.waqi.info/feed/{station_name}/"
        response = requests.get(url, params={"token": WAQI_TOKEN}, timeout=30)
        response.raise_for_status()
        return response.json().get("data")
    except requests.RequestException as e:
        logger.error(f"Failed to fetch WAQI data: {e}")
        return None


def ingest_station_reading(conn, station):
    """Insert a single station reading into telemetry table."""
    station_id = station.get("stationID")
    station_name = station.get("nameEN", station.get("nameTH", station_id))
    
    # Get location
    lat = float(station.get("lat", 0))
    lon = float(station.get("long", 0))
    
    # Check override
    if station_id in STATION_OVERRIDES:
        lat, lon, muni_id = STATION_OVERRIDES[station_id]
    else:
        muni_id = MUNICIPALITY_ID
    
    # Get sensor registry ID or create generic one
    sensor_id = f"air4thai_{station_id}"
    
    # Extract timestamp
    aqi_last = station.get("AQILast", {})
    date_str = aqi_last.get("date", "")
    time_str = aqi_last.get("time", "")
    try:
        timestamp = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        timestamp = timestamp.replace(tzinfo=timezone(offset=__import__('datetime').timedelta(hours=7)))
    except (ValueError, TypeError):
        timestamp = datetime.now(timezone.utc)
    
    metrics = []
    
    # PM2.5
    pm25_data = aqi_last.get("PM25", {})
    if pm25_data and pm25_data.get("value") is not None:
        metrics.append(("pm25", float(pm25_data["value"]), pm25_data.get("unit", "ug/m3")))
    
    # PM10
    pm10_data = aqi_last.get("PM10", {})
    if pm10_data and pm10_data.get("value") is not None:
        metrics.append(("pm10", float(pm10_data["value"]), pm10_data.get("unit", "ug/m3")))
    
    # O3
    o3_data = aqi_last.get("O3", {})
    if o3_data and o3_data.get("value") is not None:
        metrics.append(("o3", float(o3_data["value"]), o3_data.get("unit", "ppb")))
    
    # NO2
    no2_data = aqi_last.get("NO2", {})
    if no2_data and no2_data.get("value") is not None:
        metrics.append(("no2", float(no2_data["value"]), no2_data.get("unit", "ppb")))
    
    # AQI
    aqi_data = aqi_last.get("AQI", {})
    if aqi_data and aqi_data.get("aqi") is not None:
        metrics.append(("aqi", float(aqi_data["aqi"]), "index"))
    
    inserted = 0
    with conn.cursor() as cur:
        for metric_name, value, unit in metrics:
            cur.execute("""
                INSERT INTO telemetry (time, source_id, sensor_id, municipality_id, location, metric_name, metric_value, unit)
                VALUES (%s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (timestamp, sensor_id, sensor_id, muni_id, lon, lat, metric_name, value, unit))
            inserted += 1
    
    conn.commit()
    logger.info(f"Inserted {inserted} metrics for station {station_name} ({station_id})")
    return inserted


def ensure_sensor_registered(conn, station_id, station_name, lat, lon):
    """Ensure the sensor exists in the sensors table."""
    sensor_id = f"air4thai_{station_id}"
    with conn.cursor() as cur:
        cur.execute("SELECT 1 FROM sensors WHERE id = %s", (sensor_id,))
        if cur.fetchone() is None:
            cur.execute("""
                INSERT INTO sensors (id, municipality_id, source_type, protocol, location, name, is_active)
                VALUES (%s, %s, 'pm25', 'https', ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, TRUE)
                ON CONFLICT DO NOTHING
            """, (sensor_id, MUNICIPALITY_ID, lon, lat, f"Air4Thai {station_name}"))
            conn.commit()
            logger.info(f"Registered new sensor: {sensor_id}")


def run():
    """Main polling loop."""
    logger.info("Air Quality Poller starting...")
    logger.info(f"Municipality: {MUNICIPALITY_ID}")
    logger.info(f"Database: {DATABASE_URL.split('@')[-1]}")  # Safe log (no password)
    
    conn = get_db_connection()
    
    try:
        stations = fetch_air4thai_current()
        logger.info(f"Fetched {len(stations)} stations from Air4Thai")
        
        total_inserted = 0
        for station in stations:
            try:
                station_id = station.get("stationID", "unknown")
                station_name = station.get("nameEN", station_id)
                lat = float(station.get("lat", 0))
                lon = float(station.get("long", 0))
                
                # Register sensor if not exists
                ensure_sensor_registered(conn, station_id, station_name, lat, lon)
                
                # Ingest data
                count = ingest_station_reading(conn, station)
                total_inserted += count
                
            except Exception as e:
                logger.error(f"Error processing station {station.get('stationID')}: {e}")
                continue
        
        logger.info(f"Total metrics inserted: {total_inserted}")
        
    except Exception as e:
        logger.error(f"Polling error: {e}")
        sys.exit(1)
    finally:
        conn.close()
    
    logger.info("Air Quality Poller complete")


if __name__ == "__main__":
    run()
