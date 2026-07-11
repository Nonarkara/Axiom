# Axiom Framework: Open-Source City Dashboard Builder

> **Decision systems for cities, governments, and operators.** Real-time operations rooms, not PowerPoint decks. Something working before any presentation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](./docker-compose.yml)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](./docs/ARCHITECTURE.md)
[![Grafana](https://img.shields.io/badge/Grafana-10+-F46800.svg)](./docs/DEPLOYMENT.md)

---

## Table of Contents

- [Overview](#overview)
- [The Axiom Methodology](#the-axiom-methodology)
- [Your First Dashboard in 14 Days](#your-first-dashboard-in-14-days)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Data Source Integration Patterns](#data-source-integration-patterns)
- [Deployment Guides by Municipality Size](#deployment-guides-by-municipality-size)
- [Screenshots & Visual Reference](#screenshots--visual-reference)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

The **Axiom Framework** is a production-ready, open-source toolkit for building municipal intelligence dashboards. It was born from the operational reality of deploying decision-making systems across 157 SLIC Index cities and 174 Smart City Thailand Index cities—where every millisecond of latency matters and uptime is not negotiable.

Inspired by the operational philosophy of [Axiom](https://axiom.nonarkara.org)—which fuses transit, safety, and environment data onto a single screen refreshed every 42ms—this repository provides everything you need to replicate that capability for your own municipality, campus, or private city.

### What This Repository Includes

- **Complete Docker Compose stack** with PostgreSQL + PostGIS, TimescaleDB, Grafana, Metabase, ThingsBoard, Kong API Gateway, GeoNode, and CKAN
- **Production-grade database schemas** optimized for geospatial and time-series municipal data
- **Automated deployment scripts** for Ubuntu 22.04 LTS servers
- **Curated data source directory** covering Thailand national, municipal, and international open data APIs
- **Sample dashboard configurations** for Thai municipalities
- **Security hardening** with OAuth 2.0, PDPA compliance patterns, and role-based access control
- **Cost-optimized deployment tiers** for municipalities ranging from 10,000 to 10 million residents

### Core Principles

1. **Problem mapped in week one**—not after six months of procurement
2. **Something working before any presentation**—demos run on real data, not mockups
3. **24/7 operations room ready**—not a quarterly PowerPoint deck
4. **Multi-language by default**—English, Thai, and Chinese i18n support built in
5. **Dark mode first**—operators stare at these screens for 8-hour shifts

---

## The Axiom Methodology

The framework follows a battle-tested methodology refined across dozens of municipal deployments:

### Phase 1: Discovery (Days 1–7)

During the first week, the focus is on mapping the decision landscape of the municipality. This is not a requirements-gathering exercise with committees—it is a rapid operational audit. The team identifies:

- **Critical decisions made daily**: Which intersections need traffic officers? Where are flooding risks highest? Which buses are behind schedule?
- **Data that already exists**: Most municipalities sit on data they do not know they have—GPS logs, CCTV feeds, electricity consumption records, complaint databases.
- **Pain points that cost money**: Delayed response times, manual reporting, duplicated data entry.

### Phase 2: Surface (Days 8–14)

By day 14, the first **decision surface** is live. This is not a prototype—it is a production dashboard running on real data, refreshed in real time. The surface displays 3–5 KPIs that matter most to the operators. Everything else is deferred.

### Phase 3: Hardening (Days 15–30)

Authentication, role-based access, PDPA compliance, backup strategies, and documentation are formalized. The system achieves 99.5%+ uptime.

### Phase 4: Expansion (Month 2+)

Additional data sources are integrated, predictive models are deployed, and the dashboard propagates to additional departments.

---

## Your First Dashboard in 14 Days

This is the exact playbook. No steps are skipped. No assumptions about your infrastructure.

### Day 1: Provision Infrastructure

```bash
# Minimum viable server (Small Tier)
# 4 vCPU, 8 GB RAM, 100 GB SSD, Ubuntu 22.04 LTS

# Clone this repository
git clone https://github.com/your-org/axiom-framework.git
cd axiom-framework

# Run the automated setup
chmod +x scripts/setup.sh
sudo ./scripts/setup.sh --tier small --domain dashboard.yourcity.go.th
```

### Day 2: Database Initialization

The setup script automatically initializes PostgreSQL with PostGIS and TimescaleDB extensions. Verify:

```bash
docker exec -it axiom-postgres psql -U axiom -d municipal -c "\dx"
# You should see: postgis, timescaledb, pg_stat_statements
```

### Day 3: Ingest Static Data

Load your municipality's boundary, road network, and building footprints into PostGIS. Use the provided loader:

```bash
docker exec -it axiom-postgres psql -U axiom -d municipal -f /config/postgres-init.sql
```

### Day 4: Connect First API

Connect one real-time data source. We recommend starting with **air4thai** (air quality) or **Traffy Fondue** (road incidents):

```bash
curl -X POST http://localhost:8001/services \
  --data "name=air4thai" \
  --data "url=https://air4thai.pcd.go.th/services/getNewAQI_JSON.php"
```

### Day 5–6: Build First Grafana Panel

Log in to Grafana at `http://your-server:3000` (default credentials: `admin/admin`).

1. Add PostgreSQL data source
2. Create a panel showing PM2.5 by station
3. Add a geo map overlay with station locations

### Day 7: Review with Operators

Sit with the people who will use this dashboard. Watch them interact with it. Take notes. Resist the urge to add features—fix what confuses them.

### Day 8–10: Add Second Data Source

Add traffic data, flood sensors, or transit GTFS. The framework normalizes all data into a common schema:

```sql
-- Universal telemetry table (already created by init script)
INSERT INTO telemetry (source_id, timestamp, location, metric_name, metric_value, unit)
VALUES ('bts_001', NOW(), ST_SetSRID(ST_MakePoint(100.537, 13.736), 4326),
        'passenger_count', 1247, 'passengers/hour');
```

### Day 11–12: Metabase Analytics

Deploy Metabase for non-technical users to build their own questions:

```bash
docker compose up -d metabase
# Configure at http://your-server:3002
```

### Day 13: Multi-Language & Theming

Enable Thai and Chinese localization. Switch to dark mode as default. Verify all text renders correctly with Thai fonts.

### Day 14: Go Live

The dashboard is on a wall-mounted screen in the operations room. It has real data. It updates automatically. It is already more useful than the last quarterly report.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Operations  │  │   Mobile     │  │   Public     │  │   Executive     │  │
│  │    Room      │  │   App        │  │   Portal     │  │   Tablet        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
└─────────┼─────────────────┼─────────────────┼───────────────────┼───────────┘
          │                 │                 │                   │
          └─────────────────┴────────┬────────┴───────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │     KONG API GATEWAY        │
                    │   (Rate Limit, Auth, SSL)   │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼──────────┐  ┌──────────▼──────────┐  ┌─────────▼──────────┐
│     GRAFANA        │  │      METABASE       │  │   CUSTOM REACT     │
│   (Real-time       │  │   (Self-service     │  │     (Leaflet       │
│    Monitoring)     │  │    Analytics)       │  │      Map, D3)      │
└─────────┬──────────┘  └──────────┬──────────┘  └─────────┬──────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │    POSTGRESQL + POSTGIS │
                    │    + TIMESCALEDB        │
                    │                         │
                    │  • municipal (OLTP)     │
                    │  • analytics (OLAP)     │
                    │  • geospatial (PostGIS) │
                    │  • time-series (TSDB)   │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼──────────┐  ┌────────▼─────────┐  ┌────────▼─────────┐
│   THINGSBOARD      │  │     GEONODE      │  │      CKAN        │
│   (IoT / MQTT)     │  │   (GIS Server)   │  │  (Data Catalog)  │
└─────────┬──────────┘  └──────────────────┘  └──────────────────┘
          │
┌─────────▼──────────┐
│   SENSOR LAYER     │
│  ESP32 │ MQTT │ LoRa│
└────────────────────┘
```

**Data Flow:**

1. **Collection**: Sensors (ESP32), APIs (Open Data), and manual feeds push data via MQTT or HTTP
2. **Processing**: ThingsBoard or custom Node-RED flows normalize and validate data
3. **Storage**: TimescaleDB handles time-series; PostGIS handles spatial; PostgreSQL handles relational
4. **API**: Kong Gateway routes, authenticates, and rate-limits all requests
5. **Visualization**: Grafana for ops, Metabase for analysts, React for public

---

## Technology Stack

| Component | Technology | Purpose | License |
|-----------|-----------|---------|---------|
| **Database** | PostgreSQL 15+ | Primary data store | PostgreSQL License |
| **Geospatial** | PostGIS 3.4+ | Spatial queries and mapping | GPLv2 |
| **Time-Series** | TimescaleDB 2.14+ | High-performance telemetry | Apache 2.0 |
| **IoT Platform** | ThingsBoard 3.6+ | Device management, MQTT | Apache 2.0 |
| **GIS Server** | GeoNode 4.3+ | Map publishing and cataloging | GPLv2 |
| **Monitoring** | Grafana 10.4+ | Real-time operational dashboards | AGPLv3 |
| **Analytics** | Metabase 0.49+ | Self-service BI for non-technical users | AGPLv3 |
| **API Gateway** | Kong 3.6+ | Routing, auth, rate limiting | Apache 2.0 |
| **Data Catalog** | CKAN 2.11+ | Open data portal | AGPLv3 |
| **Frontend** | React 18 + Leaflet + D3 | Custom public dashboards | MIT |
| **Reverse Proxy** | Traefik 3.0+ | SSL termination, load balancing | MIT |
| **Orchestration** | Docker + Compose | Container deployment | Apache 2.0 |

---

## Data Source Integration Patterns

All data sources follow a **unified ingestion pattern** regardless of origin:

### Pattern A: REST API Polling

For sources like air4thai, BMA Open Data, and Traffy Fondue:

```python
# examples/thailand-dashboard/api_pollers/air_quality.py
import requests
from datetime import datetime

def ingest_air4thai():
    url = "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php"
    response = requests.get(url, timeout=30)
    data = response.json()
    
    for station in data["stations"]:
        insert_telemetry(
            source_id=f"air4thai_{station['stationID']}",
            timestamp=datetime.fromisoformat(station["AQILast"]["dateTime"]),
            location=(station["lat"], station["long"]),
            metric_name="pm25",
            metric_value=station["AQILast"]["PM25"]["value"],
            unit="µg/m³"
        )
```

### Pattern B: MQTT Stream (IoT)

For ESP32 sensors, LoRa gateways, and real-time counters:

```python
# Sensor publishes to: municipalities/{muni_id}/sensors/{sensor_id}/{metric}
import paho.mqtt.client as mqtt

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload)
    insert_telemetry(
        source_id=payload["sensor_id"],
        timestamp=datetime.utcnow(),
        location=(payload["lat"], payload["lon"]),
        metric_name=payload["metric"],
        metric_value=payload["value"],
        unit=payload["unit"]
    )

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("municipalities/+/sensors/+/+")
client.loop_forever()
```

### Pattern C: GTFS Realtime (Transit)

For BTS, MRT, SRT, and bus systems:

```python
from google.transit import gtfs_realtime_pb2
import requests

feed = gtfs_realtime_pb2.FeedMessage()
response = requests.get("https://data.bmatraffic.com/feeds/gtfs-rt", headers={"Authorization": "Bearer TOKEN"})
feed.ParseFromString(response.content)

for entity in feed.entity:
    if entity.trip_update:
        for stop_time in entity.trip_update.stop_time_update:
            insert_telemetry(
                source_id=entity.trip_update.trip.trip_id,
                timestamp=datetime.utcnow(),
                location=stop_location(stop_time.stop_id),  # Resolved from static GTFS
                metric_name="arrival_delay",
                metric_value=stop_time.arrival.delay,
                unit="seconds"
            )
```

### Pattern D: Webhook Push

For Traffy Fondue incident reports and DLA submissions:

```python
from flask import Flask, request

app = Flask(__name__)

@app.route("/webhooks/traffy", methods=["POST"])
def traffy_webhook():
    incident = request.json
    insert_incident(
        source_id=incident["id"],
        timestamp=datetime.fromisoformat(incident["timestamp"]),
        location=(incident["lat"], incident["long"]),
        category=incident["type"],
        description=incident["detail"],
        status=incident["state"]
    )
    return {"status": "ok"}
```

---

## Deployment Guides by Municipality Size

### Small Tier: Sikhio (Population ~20,000)

| Resource | Specification | Monthly Cost (THB) |
|----------|--------------|-------------------|
| VPS | 4 vCPU, 8 GB RAM | 1,200 |
| Storage | 100 GB SSD | 200 |
| Backup | Weekly snapshots | 100 |
| **Total** | | **~1,500 THB/month** |

- Single Docker Compose stack on one VPS
- 3–5 data sources (air quality, traffic incidents, basic census)
- Grafana only (skip Metabase initially)
- 1–2 ESP32 sensors (PM2.5, noise)
- SSL via Let's Encrypt + Traefik

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full configuration.

### Medium Tier: Nakhon Si Thammarat (Population ~100,000)

| Resource | Specification | Monthly Cost (THB) |
|----------|--------------|-------------------|
| App Server | 8 vCPU, 16 GB RAM | 3,500 |
| DB Server | 4 vCPU, 16 GB RAM, 500 GB SSD | 4,000 |
| Storage | Object storage for backups | 500 |
| Monitoring | Uptime monitoring + alerts | 300 |
| **Total** | | **~8,300 THB/month** |

- Split architecture: app and database on separate instances
- 8–12 data sources including GTFS transit feeds
- Grafana + Metabase + GeoNode
- 10–20 IoT sensors across the city
- Kong API Gateway with rate limiting

### Large Tier: Bangkok / Chulalongkorn (Population >5M)

| Resource | Specification | Monthly Cost (THB) |
|----------|--------------|-------------------|
| App Cluster | 3× 16 vCPU, 32 GB RAM | 35,000 |
| DB Cluster | Primary + 2 replicas, 64 GB RAM | 55,000 |
| TimescaleDB | Dedicated 8 vCPU partition | 12,000 |
| CDN + WAF | Cloudflare Pro or equivalent | 3,500 |
| Object Storage | 2 TB for archives | 2,000 |
| **Total** | | **~107,500 THB/month** |

- Kubernetes orchestration (microk8s or managed K8s)
- 20+ data sources, redundant feeds
- Full stack: Grafana, Metabase, GeoNode, CKAN, ThingsBoard cluster
- 100+ sensors, LoRaWAN gateway network
- Multi-AZ deployment, automated failover

---

## Screenshots & Visual Reference

While the framework is designed to be skinned for each municipality, the default Axiom-style dashboard presents the following visual paradigm:

### Operations Room View (Primary)

A single 4K wall-mounted display showing:

- **Left third**: Real-time geo map (Leaflet) with layers for traffic incidents, air quality stations, flood sensors, and bus positions. Dark basemap (CartoDB Dark Matter). Pulsing markers for active alerts.
- **Center third**: KPI cards in a 2×3 grid—current PM2.5 citywide average, active incidents, buses on time percentage, flood risk level, energy consumption vs. yesterday, and a rolling 24-hour trend sparkline.
- **Right third**: Scrolling incident feed (most recent 20) with color-coded severity and one-click drill-down to location on map.

All elements refresh automatically. No user interaction required for standard monitoring. Color palette is optimized for prolonged viewing: dark charcoal background (#1a1a2e), accent cyan (#00d4aa) for normal state, amber (#ffb800) for warning, crimson (#ff3860) for critical.

### Executive Summary View

A tablet-optimized Metabase dashboard showing:

- Week-over-week trends for 8 core indicators
- Comparative rankings against peer municipalities
- Budget execution vs. KPI achievement matrix
- Automated PDF generation for council meetings

### Public Portal View

A React-based public website showing:

- Real-time air quality map with health advisories
- Transit arrival times for top 10 bus stops
- Open data catalog with downloadable CSV/GeoJSON
- Multi-language toggle (EN/TH/ZH)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data pipeline, scaling strategy |
| [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) | Complete directory of Thailand and international data APIs |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step deployment for all three tiers |
| [docs/THAILAND_MUNICIPALITIES.md](docs/THAILAND_MUNICIPALITIES.md) | Municipality-specific deployment guides |
| [examples/thailand-dashboard/](examples/thailand-dashboard/) | Sample dashboards, queries, and configurations |

---

## Contributing

We welcome contributions from municipal IT teams, civic tech volunteers, and urban data scientists. Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting pull requests.

### Ways to Contribute

- **Municipality profiles**: Add deployment notes for your city
- **Data source connectors**: Write pollers for new APIs
- **Dashboard templates**: Share Grafana/Metabase configs
- **Translations**: Improve Thai and Chinese localization
- **Documentation**: Fix typos, add examples, clarify instructions

---

## License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

All code is provided as-is for educational and civic purposes. Municipal deployments should engage qualified systems integrators for production hardening.

---

## Acknowledgments

This framework was inspired by the operational excellence of the Axiom team and their deployments across Thai municipalities. It synthesizes open-source tooling and open-data principles to democratize access to municipal intelligence systems.

Special thanks to:
- **GISTDA** for Thailand's national geospatial data infrastructure
- **Data.go.th** for maintaining the national open data portal
- **The ThingsBoard, Grafana, and Metabase communities** for exceptional open-source software
- **Municipal IT teams across Thailand** who shared their operational realities

---

*Built for operators, not presenters. Something working before any presentation.*
