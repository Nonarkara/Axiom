# System Architecture

> This document describes the complete system architecture of the Axiom Framework, including the data pipeline, deployment tiers, IoT integration patterns, security model, and scaling strategy.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Data Pipeline](#data-pipeline)
- [3-Tier Deployment Model](#3-tier-deployment-model)
- [IoT Sensor Integration](#iot-sensor-integration)
- [Security Architecture](#security-architecture)
- [Scaling Strategy](#scaling-strategy)

---

## High-Level Architecture

The Axiom Framework follows a **layered microservices architecture** containerized with Docker. Each component is horizontally scalable and can be deployed independently based on municipality requirements.

### Layer Overview

| Layer | Components | Responsibility |
|-------|-----------|--------------|
| **Presentation** | Grafana, Metabase, React Frontend | Visualize data for operators, analysts, and public |
| **API Gateway** | Kong + Traefik | Route, authenticate, rate-limit, and secure all traffic |
| **Application** | ThingsBoard, GeoNode, CKAN, Custom APIs | Process, transform, and serve data |
| **Data** | PostgreSQL + PostGIS + TimescaleDB | Persist relational, geospatial, and time-series data |
| **Edge** | ESP32, LoRaWAN, MQTT Brokers | Collect data from physical sensors |
| **External** | Open Data APIs, GTFS, Webhooks | Ingest third-party data |

### Component Interaction

```
External Data Sources          Edge Devices
       │                            │
       ▼                            ▼
┌──────────────┐            ┌──────────────┐
│  API Pollers │            │ MQTT Broker  │
│  (Python)    │            │ (Mosquitto)  │
└──────┬───────┘            └──────┬───────┘
       │                           │
       └───────────┬───────────────┘
                   ▼
          ┌────────────────┐
          │  Kong Gateway  │
          │  (Auth/Route)  │
          └───────┬────────┘
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ThingsBoard│ │ GeoNode  │ │  CKAN    │
│(IoT Mgmt) │ │(GIS Srv) │ │(Catalog) │
└─────┬────┘ └─────┬────┘ └─────┬────┘
      │            │            │
      └────────────┼────────────┘
                   ▼
        ┌────────────────────┐
        │  PostgreSQL Cluster │
        │  • PostGIS 3.4+     │
        │  • TimescaleDB 2.14+│
        │  • Primary + Replicas│
        └──────────┬─────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Grafana  │ │ Metabase │ │ React    │
│ (Ops)    │ │ (Analyst)│ │ (Public) │
└──────────┘ └──────────┘ └──────────┘
```

### Technology Selection Rationale

**PostgreSQL + PostGIS + TimescaleDB** as the unified data backend:

- A single database engine reduces operational complexity for small and medium municipalities
- PostGIS provides industry-standard geospatial operations (projections, intersections, nearest-neighbor)
- TimescaleDB's hypertables automatically partition time-series data by time and space, delivering 10–100x query performance improvement over standard PostgreSQL for telemetry workloads
- All three extensions are production-hardened and fully ACID-compliant

**Why not a polyglot persistence approach?** For the majority of municipal deployments (Small and Medium tiers), running a single PostgreSQL instance is operationally simpler and more cost-effective than managing separate databases for relational, spatial, and time-series data. Large tier deployments may introduce read replicas and dedicated TimescaleDB partitions as documented in the scaling section.

---

## Data Pipeline

The data pipeline follows a **5-stage ETL pattern**: Collect → Validate → Transform → Store → Serve.

### Stage 1: Collection

Data enters the system through four primary channels:

| Channel | Protocol | Examples |
|---------|----------|----------|
| **REST Polling** | HTTPS | air4thai, BMA Open Data, WAQI |
| **MQTT Push** | MQTT 3.1.1/5.0 | ESP32 sensors, LoRaWAN gateways |
| **GTFS Realtime** | Protobuf over HTTP | BTS, MRT, SRT transit feeds |
| **Webhooks** | HTTPS POST | Traffy Fondue, DLA submissions |

### Stage 2: Validation

All ingested records pass through a JSON Schema validator:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TelemetryRecord",
  "type": "object",
  "required": ["source_id", "timestamp", "metric_name", "metric_value"],
  "properties": {
    "source_id": {"type": "string", "pattern": "^[a-z0-9_]+$"},
    "timestamp": {"type": "string", "format": "date-time"},
    "location": {
      "type": "object",
      "required": ["lat", "lon"],
      "properties": {
        "lat": {"type": "number", "minimum": -90, "maximum": 90},
        "lon": {"type": "number", "minimum": -180, "maximum": 180}
      }
    },
    "metric_name": {"type": "string", "enum": ["pm25", "pm10", "temperature", "humidity", "noise_db", "traffic_speed", "passenger_count", "flood_depth", "power_usage"]},
    "metric_value": {"type": "number"},
    "unit": {"type": "string"}
  }
}
```

Invalid records are logged to a dead-letter queue for manual inspection.

### Stage 3: Transform

Data is normalized into the **unified municipal schema**. Key transformations:

- All coordinates converted to **EPSG:4326 (WGS84)**
- Timestamps normalized to **UTC** with original timezone preserved
- Sensor IDs namespaced: `{municipality}_{device_type}_{serial}`
- Enumerated categories mapped to standard vocabularies

### Stage 4: Store

Data is written to purpose-optimized tables:

| Data Type | Destination | Partitioning |
|-----------|------------|--------------|
| Time-series telemetry | `telemetry` hypertable | By timestamp (1-hour chunks), space partition by municipality |
| Geospatial features | `infrastructure` table | PostGIS spatial index (GiST) |
| Incidents/events | `incidents` table | By timestamp + spatial index |
| Reference data | `municipalities`, `sensors`, `routes` | Standard B-tree indexes |

### Stage 5: Serve

The API Gateway exposes endpoints for each consumer:

| Endpoint | Consumer | Data |
|----------|----------|------|
| `/api/v1/telemetry/latest` | Grafana | Real-time metrics |
| `/api/v1/telemetry/historical` | Metabase | Aggregated analytics |
| `/api/v1/incidents/active` | Operations Room | Open incident feed |
| `/api/v1/geo/features` | Leaflet Map | GeoJSON layers |
| `/api/v1/gtfs/realtime` | Transit App | Vehicle positions |

---

## 3-Tier Deployment Model

### Small Tier: Sikhio Profile

**Target**: Municipalities under 50,000 population. Single-server deployment.

```yaml
# docker-compose.small.yml (excerpt)
services:
  postgres:
    image: timescale/timescaledb-postgis:latest-pg15
    resources:
      limits:
        memory: 3G
        cpus: '2.0'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  grafana:
    image: grafana/grafana:10.4.0
    resources:
      limits:
        memory: 512M
        cpus: '0.5'

  thingsboard:
    image: thingsboard/tb-postgres:3.6.0
    resources:
      limits:
        memory: 2G
        cpus: '1.0'
```

**Characteristics**:
- All services on a single 4 vCPU / 8 GB VPS
- PostgreSQL handles up to ~1,000 telemetry inserts/second
- Grafana as sole visualization layer
- Manual SSL certificate management
- Daily automated backups to object storage

### Medium Tier: Nakhon Si Thammarat Profile

**Target**: Municipalities 50,000–500,000 population. Split architecture.

```
┌─────────────────────────────────────────────────┐
│              Application Server                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Grafana  │ │ Metabase │ │   API Pollers    │ │
│  │          │ │          │ │   (Python/Node)  │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Kong GW  │ │ GeoNode  │ │   ThingsBoard    │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────┬───────────────────────────┘
                      │  private network
┌─────────────────────┴───────────────────────────┐
│              Database Server                     │
│  ┌──────────────────────────────────────────┐   │
│  │  PostgreSQL 15 Primary                   │   │
│  │  • PostGIS 3.4                           │   │
│  │  • TimescaleDB 2.14                      │   │
│  │  • 500 GB SSD, 16 GB RAM allocated       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Characteristics**:
- Dedicated database server with 16 GB RAM for PostgreSQL cache
- Grafana + Metabase for dual-audience visualization
- Kong API Gateway with consumer-specific rate limits
- Automated daily backups + weekly full snapshots
- Supports up to ~10,000 inserts/second

### Large Tier: Bangkok / Chulalongkorn Profile

**Target**: Municipalities over 500,000 population. Kubernetes-orchestrated cluster.

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer (Traefik)                   │
│                 SSL Termination + WAF                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  Grafana x2  │ │Metabase x2│ │  React x3    │
│  (HA mode)   │ │ (HA mode) │ │  (Public)    │
└──────┬───────┘ └────┬─────┘ └──────┬───────┘
       └──────────────┼──────────────┘
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
┌─────────────────┐   ┌─────────────────┐
│   Kong Cluster  │   │  ThingsBoard    │
│   (3 instances) │   │  Cluster        │
└────────┬────────┘   └────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  PG      │ │  PG      │ │  PG      │
│ Primary  │ │ Replica  │ │ Replica  │
│ (writes) │ │ (reads)  │ │ (reads)  │
└──────────┘ └──────────┘ └──────────┘
```

**Characteristics**:
- 3-node PostgreSQL cluster (synchronous replication)
- Dedicated TimescaleDB partition manager
- Horizontal pod autoscaling for all stateless services
- Multi-AZ deployment with automatic failover
- 100,000+ inserts/second capacity

---

## IoT Sensor Integration

The framework supports a **unified IoT ingestion pipeline** based on the ESP32 → MQTT → ThingsBoard → TimescaleDB chain.

### ESP32 Sensor Firmware Pattern

Sensors run a standard firmware template that handles WiFi connection, MQTT authentication, JSON payload formatting, and deep-sleep cycles for battery conservation.

```cpp
// templates/esp32_sensor_template.ino
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* SSID = "MUNICIPAL_IOT";
const char* PASSWORD = "YOUR_SECURE_PASSWORD";
const char* MQTT_SERVER = "thingsboard.axiom.local";
const char* TOKEN = "DEVICE_ACCESS_TOKEN";

const int SENSOR_ID = 42;
const float LAT = 13.7563;
const float LON = 100.5018;

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

void publishTelemetry(float pm25, float temperature, float humidity) {
  StaticJsonDocument<256> doc;
  doc["sensor_id"] = SENSOR_ID;
  doc["lat"] = LAT;
  doc["lon"] = LON;
  doc["pm25"] = pm25;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["timestamp"] = millis();

  char payload[256];
  serializeJson(doc, payload);
  
  mqtt.publish("v1/devices/me/telemetry", payload);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  mqtt.setServer(MQTT_SERVER, 1883);
  mqtt.connect("ESP32", TOKEN, NULL);
  
  // Read sensors
  float pm25 = readPMS5003();
  float temp = readDHT22Temp();
  float hum = readDHT22Humidity();
  
  publishTelemetry(pm25, temp, hum);
  
  // Deep sleep for 60 seconds (battery saving)
  esp_sleep_enable_timer_wakeup(60 * 1000000);
  esp_deep_sleep_start();
}

void loop() {} // Never reached due to deep sleep
```

### ThingsBoard Rule Chain

Inside ThingsBoard, a rule chain processes incoming telemetry:

1. **Message Type Switch**: Route telemetry vs. attribute updates
2. **Script Filter**: Validate payload schema (reject out-of-range values)
3. **Save Timeseries**: Persist to internal ThingsBoard database
4. **External - REST API Call**: Forward to PostgreSQL ingest endpoint
5. **Create Alarm**: Trigger if PM2.5 > 75 µg/m³ (Thai NAAQS threshold)

### TimescaleDB Ingestion

Forwarded data lands in the `telemetry` hypertable via the ingest API:

```sql
-- The telemetry table is partitioned automatically
CREATE TABLE telemetry (
    time TIMESTAMPTZ NOT NULL,
    source_id TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    metric_name TEXT NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    unit TEXT,
    municipality_id TEXT NOT NULL
);

-- Convert to hypertable with 1-hour chunks
SELECT create_hypertable('telemetry', 'time', chunk_time_interval => INTERVAL '1 hour');

-- Space partition by municipality for query locality
SELECT add_dimension('telemetry', 'municipality_id', 4);
```

---

## Security Architecture

### Authentication

| Layer | Mechanism | Notes |
|-------|-----------|-------|
| Public Portal | Anonymous (read-only) | No auth required |
| Grafana | OAuth 2.0 + local DB | Google/Line OAuth recommended |
| Metabase | SSO via OAuth 2.0 | Auto-provision accounts |
| API Endpoints | JWT tokens via Kong | 1-hour expiry, refresh tokens |
| Admin Functions | MFA-required | TOTP via authenticator app |

### PDPA Compliance (Thailand)

The framework implements Personal Data Protection Act B.E. 2562 (2019) requirements:

1. **Consent logging**: All data collection points log consent timestamp and version
2. **Anonymization**: Personal identifiers hashed with SHA-256 + salt; reverse lookup restricted to Data Controller role
3. **Retention policies**: Automatic data purging after retention period (configurable per dataset)
4. **Access logging**: All database queries logged with user ID, timestamp, and rows accessed
5. **Right to deletion**: API endpoint for data subject erasure requests
6. **Breach notification**: Automated alerting on anomalous access patterns

### Role-Based Access Control

| Role | Grafana | Metabase | API Access | Data Scope |
|------|---------|----------|------------|------------|
| **Public** | None | None | Read-only public endpoints | Aggregated, anonymized |
| **Analyst** | Viewer | Editor | Read all non-sensitive | Department-level |
| **Operator** | Editor | Viewer | Read all, write incidents | Full municipality |
| **Admin** | Admin | Admin | Full CRUD | Cross-municipality |
| **System** | — | — | Internal service mesh | Infrastructure only |

### Network Security

- All inter-service communication over TLS 1.3
- Database connections require client certificates
- Kong Gateway enforces rate limiting: 100 req/min per anonymous client, 10,000 req/min per authenticated client
- Fail2ban on host OS blocks repeated failed auth attempts
- Weekly automated security scans via Trivy

---

## Scaling Strategy

### Vertical Scaling (First Response)

When insert volume exceeds current capacity:

1. Increase PostgreSQL `shared_buffers` to 25% of available RAM
2. Increase TimescaleDB `max_background_workers`
3. Add read replica for Grafana/Metabase queries

### Horizontal Scaling (Sustained Growth)

When single-server limits are reached:

1. **Database sharding**: Partition by municipality ID across multiple PostgreSQL instances
2. **API Gateway clustering**: Kong in DB-less mode with load balancer
3. **ThingsBoard clustering**: Split rule engine and transport layers
4. **CDN**: Static map tiles and dashboard assets served via Cloudflare

### Performance Benchmarks

| Metric | Small Tier | Medium Tier | Large Tier |
|--------|-----------|-------------|------------|
| Max inserts/sec | 1,000 | 10,000 | 100,000+ |
| Dashboard users | 25 | 200 | 2,000+ |
| Concurrent maps | 10 | 100 | 1,000+ |
| Data retention | 1 year | 3 years | 7 years |
| Query latency (p95) | 500ms | 200ms | 50ms |
| Uptime target | 99.5% | 99.9% | 99.94% |

### Disaster Recovery

| Tier | Backup Strategy | RTO | RPO |
|------|----------------|-----|-----|
| Small | Daily snapshots to S3 | 4 hours | 24 hours |
| Medium | Hourly WAL archiving + daily full | 1 hour | 1 hour |
| Large | Continuous streaming + cross-region replica | 15 minutes | 5 minutes |

---

*For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md). For data source configuration, see [DATA_SOURCES.md](DATA_SOURCES.md).*
