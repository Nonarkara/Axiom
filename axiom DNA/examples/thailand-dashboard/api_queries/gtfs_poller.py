#!/usr/bin/env python3
"""
Axiom Framework - GTFS Realtime Transit Poller
Polls BMATraffic GTFS-RT feed for vehicle positions and trip updates.
"""

import os
import sys
import logging
import psycopg2
import requests
from datetime import datetime, timezone
from google.transit import gtfs_realtime_pb2

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("gtfs_poller")

# Configuration
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://axiom:axiom@localhost:5432/municipal")
BMA_API_KEY = os.environ.get("BMA_API_KEY", "")
GTFS_RT_URL = "https://data.bmatraffic.com/feeds/gtfs-rt"
MUNICIPALITY_ID = os.environ.get("MUNICIPALITY_ID", "chula")

# Route type mapping
ROUTE_TYPES = {
    "BTS": {"route_prefix": ["BTS"], "metric_prefix": "bts"},
    "MRT": {"route_prefix": ["MRT", "BEM"], "metric_prefix": "mrt"},
    "ARL": {"route_prefix": ["ARL"], "metric_prefix": "arl"},
    "BRT": {"route_prefix": ["BRT"], "metric_prefix": "brt"},
    "BUS": {"route_prefix": ["BMTA", "BGC"], "metric_prefix": "bus"},
}


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


def fetch_gtfs_rt():
    """Fetch GTFS-Realtime feed from BMA."""
    headers = {}
    if BMA_API_KEY:
        headers["Authorization"] = f"Bearer {BMA_API_KEY}"
    
    try:
        response = requests.get(GTFS_RT_URL, headers=headers, timeout=30)
        response.raise_for_status()
        
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        return feed
    except requests.RequestException as e:
        logger.error(f"Failed to fetch GTFS-RT: {e}")
        return None
    except Exception as e:
        logger.error(f"Failed to parse GTFS-RT: {e}")
        return None


def classify_route(route_id):
    """Classify route into transit system."""
    route_id_upper = route_id.upper()
    for system, config in ROUTE_TYPES.items():
        for prefix in config["route_prefix"]:
            if prefix in route_id_upper:
                return system, config["metric_prefix"]
    return "OTHER", "transit"


def ingest_vehicle_positions(conn, feed):
    """Process VehiclePosition entities from GTFS-RT feed."""
    inserted = 0
    timestamp = datetime.now(timezone.utc)
    
    with conn.cursor() as cur:
        for entity in feed.entity:
            if not entity.HasField("vehicle"):
                continue
            
            v = entity.vehicle
            try:
                trip_id = v.trip.trip_id if v.trip else "unknown"
                route_id = v.trip.route_id if v.trip else "unknown"
                vehicle_id = v.vehicle.id if v.vehicle else "unknown"
                
                lat = v.position.latitude if v.position else None
                lon = v.position.longitude if v.position else None
                bearing = v.position.bearing if v.position else None
                speed = v.position.speed if v.position else None  # m/s
                
                if not lat or not lon:
                    continue
                
                system, metric_prefix = classify_route(route_id)
                sensor_id = f"{metric_prefix}_{vehicle_id}"
                
                # Insert position
                cur.execute("""
                    INSERT INTO telemetry 
                        (time, source_id, sensor_id, municipality_id, location, 
                         metric_name, metric_value, unit, metadata_json)
                    VALUES (%s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                            %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (
                    timestamp,
                    sensor_id,
                    sensor_id,
                    MUNICIPALITY_ID,
                    lon, lat,
                    f"{metric_prefix}_position_lat",
                    lat,
                    "degrees",
                    json.dumps({"trip_id": trip_id, "route_id": route_id, 
                               "bearing": bearing, "system": system})
                ))
                
                # Insert speed if available
                if speed is not None:
                    speed_kmh = speed * 3.6
                    cur.execute("""
                        INSERT INTO telemetry 
                            (time, source_id, sensor_id, municipality_id, location,
                             metric_name, metric_value, unit)
                        VALUES (%s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                                %s, %s, %s)
                        ON CONFLICT DO NOTHING
                    """, (
                        timestamp,
                        sensor_id,
                        sensor_id,
                        MUNICIPALITY_ID,
                        lon, lat,
                        f"{metric_prefix}_speed",
                        round(speed_kmh, 2),
                        "km/h"
                    ))
                
                inserted += 1
                
            except Exception as e:
                logger.debug(f"Error processing vehicle {vehicle_id}: {e}")
                continue
    
    conn.commit()
    logger.info(f"Inserted {inserted} vehicle position records")
    return inserted


def ingest_trip_updates(conn, feed):
    """Process TripUpdate entities for arrival delay tracking."""
    inserted = 0
    timestamp = datetime.now(timezone.utc)
    
    with conn.cursor() as cur:
        for entity in feed.entity:
            if not entity.HasField("trip_update"):
                continue
            
            tu = entity.trip_update
            try:
                trip_id = tu.trip.trip_id if tu.trip else "unknown"
                route_id = tu.trip.route_id if tu.trip else "unknown"
                
                system, metric_prefix = classify_route(route_id)
                
                for stop_time in tu.stop_time_update:
                    delay = None
                    if stop_time.HasField("arrival"):
                        delay = stop_time.arrival.delay
                    elif stop_time.HasField("departure"):
                        delay = stop_time.departure.delay
                    
                    if delay is None:
                        continue
                    
                    sensor_id = f"{metric_prefix}_{trip_id}"
                    
                    cur.execute("""
                        INSERT INTO telemetry 
                            (time, source_id, sensor_id, municipality_id,
                             metric_name, metric_value, unit, metadata_json)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT DO NOTHING
                    """, (
                        timestamp,
                        sensor_id,
                        sensor_id,
                        MUNICIPALITY_ID,
                        f"{metric_prefix}_arrival_delay",
                        delay,
                        "seconds",
                        json.dumps({"trip_id": trip_id, "route_id": route_id,
                                   "stop_sequence": stop_time.stop_sequence,
                                   "stop_id": stop_time.stop_id})
                    ))
                    inserted += 1
                    
            except Exception as e:
                logger.debug(f"Error processing trip update {trip_id}: {e}")
                continue
    
    conn.commit()
    logger.info(f"Inserted {inserted} trip update records")
    return inserted


def run():
    logger.info("GTFS-RT Poller starting...")
    logger.info(f"Municipality: {MUNICIPALITY_ID}")
    logger.info(f"Feed URL: {GTFS_RT_URL}")
    
    conn = get_db_connection()
    
    try:
        feed = fetch_gtfs_rt()
        if not feed:
            logger.error("No feed data received")
            sys.exit(1)
        
        logger.info(f"Feed timestamp: {feed.header.timestamp}")
        logger.info(f"Entities in feed: {len(feed.entity)}")
        
        vehicle_count = ingest_vehicle_positions(conn, feed)
        trip_count = ingest_trip_updates(conn, feed)
        
        logger.info(f"Total inserted: {vehicle_count + trip_count}")
        
    except Exception as e:
        logger.error(f"Polling error: {e}")
        sys.exit(1)
    finally:
        conn.close()
    
    logger.info("GTFS-RT Poller complete")


if __name__ == "__main__":
    run()
