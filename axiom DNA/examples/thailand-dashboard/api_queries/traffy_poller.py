#!/usr/bin/env python3
"""
Axiom Framework - Traffy Fondue Incident Poller
Polls Traffy Fondue API for road incident reports and ingests into PostgreSQL.
"""

import os
import sys
import json
import logging
import psycopg2
import requests
from datetime import datetime, timezone, timedelta

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("traffy_poller")

# Configuration
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://axiom:axiom@localhost:5432/municipal")
TRAFFY_API_KEY = os.environ.get("TRAFFY_API_KEY", "")
TRAFFY_API_BASE = "https://api.traffy.in.th/v1"
MUNICIPALITY_ID = os.environ.get("MUNICIPALITY_ID", "sikhio")
BBOX = os.environ.get("BBOX", "100.3,13.6,100.7,13.9")  # Default: Bangkok area

# Municipality bounding boxes
MUNI_BBOXES = {
    "sikhio": "101.2,14.8,101.5,15.0",
    "yala_city": "101.5,6.4,101.8,6.7",
    "nakhon_si": "99.8,8.3,100.1,8.6",
    "kmitl": "100.7,13.7,100.9,13.8",
    "chula": "100.5,13.7,100.6,13.8",
}


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


def fetch_incidents(hours=24):
    """Fetch recent incidents from Traffy Fondue."""
    if not TRAFFY_API_KEY:
        logger.error("TRAFFY_API_KEY not set. Get one from https://fondue.in.th")
        return []
    
    bbox = MUNI_BBOXES.get(MUNICIPALITY_ID, BBOX)
    
    try:
        response = requests.get(
            f"{TRAFFY_API_BASE}/incidents",
            headers={"X-API-Key": TRAFFY_API_KEY},
            params={"hours": hours, "bbox": bbox},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data.get("features", [])
    except requests.RequestException as e:
        logger.error(f"Failed to fetch Traffy data: {e}")
        return []


def map_incident_type(traffy_type):
    """Map Traffy incident types to Axiom incident types."""
    type_mapping = {
        "ถนน": "road_damage",
        "น้ำท่วม": "flooding",
        "ควัน": "pollution",
        "ไฟฟ้า": "power_outage",
        "ต้นไม้": "infrastructure",
        "กลิ่น": "pollution",
        "เสียง": "noise_complaint",
        "ขยะ": "waste_issue",
        "ท่อระบายน้ำ": "infrastructure",
        "สะพาน": "infrastructure",
        "อุบัติเหตุ": "traffic_accident",
    }
    return type_mapping.get(traffy_type, "other")


def map_severity(traffy_state):
    """Map Traffy state to severity."""
    if traffy_state in ["finish"]:
        return "low"
    elif traffy_state in ["agency"]:
        return "medium"
    elif traffy_state in ["reported"]:
        return "high"
    return "medium"


def ingest_incidents(conn, features):
    """Insert Traffy incidents into the incidents table."""
    inserted = 0
    skipped = 0
    
    with conn.cursor() as cur:
        for feature in features:
            try:
                props = feature.get("properties", {})
                geometry = feature.get("geometry", {})
                
                external_id = str(props.get("id", ""))
                if not external_id:
                    continue
                
                # Check if already exists
                cur.execute("SELECT 1 FROM incidents WHERE external_id = %s", (external_id,))
                if cur.fetchone():
                    skipped += 1
                    continue
                
                # Parse location
                coords = geometry.get("coordinates", [None, None])
                lon = coords[0] if coords else None
                lat = coords[1] if len(coords) > 1 else None
                
                # Parse timestamp
                timestamp_str = props.get("timestamp", "")
                try:
                    timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
                except (ValueError, AttributeError):
                    timestamp = datetime.now(timezone.utc)
                
                # Map fields
                incident_type = map_incident_type(props.get("type", ""))
                severity = map_severity(props.get("state", ""))
                title_th = props.get("detail", "")
                photo_urls = props.get("photo", [])
                if isinstance(photo_urls, str):
                    photo_urls = [photo_urls] if photo_urls else []
                
                location_geo = None
                if lon and lat:
                    location_geo = f"SRID=4326;POINT({lon} {lat})"
                
                cur.execute("""
                    INSERT INTO incidents 
                        (source_id, external_id, municipality_id, location, incident_type, 
                         severity, title_th, status, photo_urls, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (
                    f"traffy_{external_id}",
                    external_id,
                    MUNICIPALITY_ID,
                    location_geo,
                    incident_type,
                    severity,
                    title_th,
                    "reported",
                    photo_urls,
                    timestamp
                ))
                inserted += 1
                
            except Exception as e:
                logger.error(f"Error processing incident {props.get('id')}: {e}")
                continue
    
    conn.commit()
    logger.info(f"Inserted {inserted} new incidents, skipped {skipped} existing")
    return inserted


def run():
    logger.info("Traffy Fondue Poller starting...")
    logger.info(f"Municipality: {MUNICIPALITY_ID}")
    
    conn = get_db_connection()
    
    try:
        features = fetch_incidents(hours=24)
        logger.info(f"Fetched {len(features)} incidents from Traffy Fondue")
        
        if features:
            ingest_incidents(conn, features)
        
    except Exception as e:
        logger.error(f"Polling error: {e}")
        sys.exit(1)
    finally:
        conn.close()
    
    logger.info("Traffy Fondue Poller complete")


if __name__ == "__main__":
    run()
