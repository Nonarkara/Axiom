# Deployment Guide

> Complete step-by-step deployment instructions for the Axiom Framework across Small, Medium, and Large tiers.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: PostgreSQL + PostGIS + TimescaleDB](#step-1-postgresql--postgis--timescaledb)
- [Step 2: GeoNode GIS Platform](#step-2-geonode-gis-platform)
- [Step 3: ThingsBoard IoT Platform](#step-3-thingsboard-iot-platform)
- [Step 4: Grafana Monitoring Dashboard](#step-4-grafana-monitoring-dashboard)
- [Step 5: Metabase Analytics Dashboard](#step-5-metabase-analytics-dashboard)
- [Step 6: Kong API Gateway](#step-6-kong-api-gateway)
- [Step 7: CKAN Data Catalog](#step-7-ckan-data-catalog)
- [Step 8: ESP32 Sensor Deployment](#step-8-esp32-sensor-deployment)
- [Cost Breakdown by Tier](#cost-breakdown-by-tier)

---

## Prerequisites

### Hardware Requirements

| Tier | CPU | RAM | Storage | Network |
|------|-----|-----|---------|---------|
| Small | 4 vCPU | 8 GB | 100 GB SSD | 100 Mbps |
| Medium | 8 vCPU (app) + 4 vCPU (db) | 16 GB + 16 GB | 200 GB + 500 GB SSD | 1 Gbps |
| Large | 3× 16 vCPU | 3× 32 GB | 2 TB NVMe + object storage | 10 Gbps |

### Software Requirements

- **OS**: Ubuntu 22.04 LTS (recommended) or Debian 12
- **Docker**: 25.0+ (`docker --version`)
- **Docker Compose**: 2.24+ (`docker compose version`)
- **Git**: 2.40+
- **OpenSSL**: 3.0+ (for certificate generation)

### Pre-Installation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
 curl -fsSL https://get.docker.com | sh
 sudo usermod -aG docker $USER
 newgrp docker

# Install Docker Compose plugin
 sudo apt install docker-compose-plugin

# Verify
 docker --version  # Docker version 25.0.0+
 docker compose version  # Docker Compose version 2.24.0+

# Clone repository
git clone https://github.com/your-org/axiom-framework.git
cd axiom-framework
```

---

## Step 1: PostgreSQL + PostGIS + TimescaleDB

The database is the foundation of the entire stack. We use the TimescaleDB official image which bundles PostgreSQL 15, PostGIS 3.4, and TimescaleDB 2.14.

### Initialize Database

```bash
# Create Docker network (used by all services)
docker network create axiom-network

# Start PostgreSQL
docker run -d \
  --name axiom-postgres \
  --network axiom-network \
  -e POSTGRES_USER=axiom \
  -e POSTGRES_PASSWORD=$(openssl rand -base64 32) \
  -e POSTGRES_DB=municipal \
  -e TZ=Asia/Bangkok \
  -v postgres_data:/var/lib/postgresql/data \
  -v $(pwd)/config/postgres-init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 \
  timescale/timescaledb-postgis:latest-pg15 \
  -c shared_buffers=2GB \
  -c effective_cache_size=6GB \
  -c work_mem=32MB \
  -c maintenance_work_mem=512MB \
  -c max_connections=200

# Wait for initialization
sleep 15

# Verify extensions
docker exec -it axiom-postgres psql -U axiom -d municipal -c "\dx"
```

Expected output should include:
- `postgis` | 3.4.0
- `timescaledb` | 2.14.0
- `pg_stat_statements`

### Performance Tuning by Tier

**Small Tier** (8 GB RAM server):
```
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 32MB
maintenance_work_mem = 512MB
max_connections = 100
```

**Medium Tier** (16 GB dedicated DB server):
```
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 64MB
maintenance_work_mem = 1GB
max_connections = 200
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
```

**Large Tier** (64 GB DB cluster):
```
shared_buffers = 16GB
effective_cache_size = 48GB
work_mem = 256MB
maintenance_work_mem = 4GB
max_connections = 500
max_parallel_workers_per_gather = 8
max_parallel_workers = 16
timescaledb.max_background_workers = 16
```

---

## Step 2: GeoNode GIS Platform

GeoNode provides map publishing, layer management, and metadata cataloging for geospatial datasets.

```bash
# GeoNode requires its own Docker Compose setup
mkdir -p /opt/geonode && cd /opt/geonode

# Download official GeoNode Docker setup
curl -L https://github.com/GeoNode/geonode-project/archive/refs/tags/4.3.0.tar.gz | tar xz --strip-components=1

# Configure environment
cp .env.sample .env
sed -i 's/GEONODE_INSTANCE_NAME=.*/GEONODE_INSTANCE_NAME=axiom-gis/' .env
sed -i 's/HTTP_HOST=.*/HTTP_HOST=gis.yourcity.go.th/' .env
sed -i 's/ADMIN_EMAIL=.*/ADMIN_EMAIL=admin@yourcity.go.th/' .env

# Start GeoNode
 docker compose -f docker-compose.yml up -d

# Verify: http://gis.yourcity.go.th
```

**Post-Install Configuration**:
1. Upload municipality boundary (Shapefile or GeoJSON)
2. Configure Thai basemap (GISTDA WMS or CartoDB)
3. Set up user groups matching RBAC roles

---

## Step 3: ThingsBoard IoT Platform

ThingsBoard handles device provisioning, MQTT ingestion, rule chains, and alarm management.

```bash
# Create ThingsBoard data directory
mkdir -p /opt/thingsboard/data && cd /opt/thingsboard

# Docker Compose for ThingsBoard
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  thingsboard:
    image: thingsboard/tb-postgres:3.6.0
    container_name: axiom-thingsboard
    restart: always
    networks:
      - axiom-network
    ports:
      - "8080:9090"
      - "1883:1883"
      - "5683:5683/udp"
    environment:
      TB_QUEUE_TYPE: in-memory
      SPRING_DATASOURCE_URL: jdbc:postgresql://axiom-postgres:5432/thingsboard
      SPRING_DATASOURCE_USERNAME: thingsboard
      SPRING_DATASOURCE_PASSWORD: ${TB_PASSWORD}
    volumes:
      - thingsboard_data:/data
      - thingsboard_logs:/var/log/thingsboard

volumes:
  thingsboard_data:
  thingsboard_logs:

networks:
  axiom-network:
    external: true
EOF

# Generate secure password and create database user
TB_PASSWORD=$(openssl rand -base64 24)
echo "TB_PASSWORD=$TB_PASSWORD" > .env

docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE USER thingsboard WITH PASSWORD '$TB_PASSWORD';"
docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "GRANT ALL PRIVILEGES ON DATABASE thingsboard TO thingsboard;"

# Start ThingsBoard
 docker compose up -d

# Default credentials: sysadmin@thingsboard.org / sysadmin
```

**Device Provisioning**:
1. Log in to ThingsBoard UI
2. Create a device profile: "Environmental Sensor"
3. Add a new device: `sikhio_pm25_001`
4. Copy the access token for ESP32 firmware configuration
5. Configure rule chain to forward telemetry to PostgreSQL ingest endpoint

---

## Step 4: Grafana Monitoring Dashboard

Grafana is the primary visualization layer for operations room displays.

```bash
mkdir -p /opt/grafana/{data,provisioning/{dashboards,datasources}} && cd /opt/grafana

# Create provisioning config
cat > provisioning/datasources/postgres.yml << 'EOF'
apiVersion: 1
datasources:
  - name: MunicipalDB
    type: postgres
    url: axiom-postgres:5432
    database: municipal
    user: grafana_reader
    secureJsonData:
      password: ${GRAFANA_DB_PASSWORD}
    jsonData:
      sslmode: disable
      maxOpenConns: 100
      maxIdleConns: 100
      maxIdleConnsAuto: true
      connMaxLifetime: 14400
      timescaledb: true
    isDefault: true
EOF

# Create Grafana Docker Compose snippet
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  grafana:
    image: grafana/grafana:10.4.0
    container_name: axiom-grafana
    restart: always
    networks:
      - axiom-network
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
      - GF_SERVER_ROOT_URL=https://ops.yourcity.go.th
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-geomap-panel
      - GF_DATE_FORMATS_DEFAULT_TIMEZONE=Asia/Bangkok
      - GF_DEFAULT_THEME=dark
    volumes:
      - ./data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning

networks:
  axiom-network:
    external: true
EOF

# Set passwords
GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16)
echo "GRAFANA_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD" >> .env
echo "Admin password: $GRAFANA_ADMIN_PASSWORD"

# Create read-only database user
docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE USER grafana_reader WITH PASSWORD '$(openssl rand -base64 24)';"
docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "GRANT SELECT ON ALL TABLES IN SCHEMA public TO grafana_reader;"

 docker compose up -d
```

**First Dashboard Setup**:
1. Navigate to http://your-server:3000
2. Add PostgreSQL data source (or use provisioned source)
3. Import example dashboard: `examples/thailand-dashboard/grafana/dashboard.json`
4. Verify panels display correctly

---

## Step 5: Metabase Analytics Dashboard

Metabase provides self-service analytics for non-technical municipal staff.

```bash
mkdir -p /opt/metabase/data && cd /opt/metabase

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  metabase:
    image: metabase/metabase:v0.49.0
    container_name: axiom-metabase
    restart: always
    networks:
      - axiom-network
    ports:
      - "3002:3000"
    environment:
      - MB_DB_TYPE=postgres
      - MB_DB_DBNAME=metabase
      - MB_DB_PORT=5432
      - MB_DB_USER=metabase
      - MB_DB_PASS=${MB_PASSWORD}
      - MB_DB_HOST=axiom-postgres
      - MB_SITE_NAME="Municipal Analytics"
      - MB_APPLICATION_NAME="axiom-metabase"
    volumes:
      - ./data:/metabase-data

networks:
  axiom-network:
    external: true
EOF

# Create Metabase database and user
MB_PASSWORD=$(openssl rand -base64 24)
echo "MB_PASSWORD=$MB_PASSWORD" >> .env

docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE USER metabase WITH PASSWORD '$MB_PASSWORD';"
docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE DATABASE metabase OWNER metabase;"

 docker compose up -d
```

**Setup Wizard** (first run):
1. Navigate to http://your-server:3002
2. Complete admin registration
3. Add MunicipalDB as a data source
4. Invite department users with appropriate permissions

---

## Step 6: Kong API Gateway

Kong handles all external API traffic: routing, authentication, rate limiting, and SSL.

```bash
mkdir -p /opt/kong && cd /opt/kong

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  kong:
    image: kong:3.6.0
    container_name: axiom-kong
    restart: always
    networks:
      - axiom-network
    ports:
      - "8000:8000"   # Proxy HTTP
      - "8443:8443"   # Proxy HTTPS
      - "8001:8001"   # Admin API
      - "8444:8444"   # Admin API HTTPS
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: axiom-postgres
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: ${KONG_DB_PASSWORD}
      KONG_PG_DATABASE: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_PLUGINS: bundled,rate-limiting,key-auth,jwt
    command: >
      sh -c "kong migrations bootstrap && kong start"

networks:
  axiom-network:
    external: true
EOF

# Create Kong database
KONG_DB_PASSWORD=$(openssl rand -base64 24)
echo "KONG_DB_PASSWORD=$KONG_DB_PASSWORD" >> .env

docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE USER kong WITH PASSWORD '$KONG_DB_PASSWORD';"
docker exec -it axiom-postgres psql -U axiom -d municipal -c \
  "CREATE DATABASE kong OWNER kong;"

 docker compose up -d

# Configure services and routes
curl -X POST http://localhost:8001/services \
  --data "name=telemetry-api" \
  --data "url=http://axiom-thingsboard:9090"

curl -X POST http://localhost:8001/services/telemetry-api/routes \
  --data "paths[]=/api/v1/telemetry" \
  --data "strip_path=false"

# Enable rate limiting
curl -X POST http://localhost:8001/services/telemetry-api/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=100" \
  --data "config.policy=redis"
```

---

## Step 7: CKAN Data Catalog

CKAN serves as the public open data portal for publishing municipal datasets.

```bash
mkdir -p /opt/ckan && cd /opt/ckan

# Use CKAN's official Docker Compose
curl -L https://github.com/ckan/ckan-docker/archive/refs/tags/ckan-2.11.0.tar.gz | tar xz --strip-components=1

# Configure
cp .env.example .env
sed -i 's/CKAN_SITE_URL=.*/CKAN_SITE_URL=https://data.yourcity.go.th/' .env
sed -i 's/CKAN_SQLALCHEMY_URL=.*/CKAN_SQLALCHEMY_URL=postgresql:\/\/ckan:${CKAN_DB_PASSWORD}@axiom-postgres:5432\/ckan/' .env

 docker compose up -d
```

---

## Step 8: ESP32 Sensor Deployment

### Hardware Requirements (Per Sensor Node)

| Component | Specification | Approximate Cost (THB) |
|-----------|--------------|----------------------|
| ESP32 DevKit | ESP32-WROOM-32 | 120 |
| PM2.5 Sensor | PMS5003 (Plantower) | 350 |
| Temperature/Humidity | DHT22 or SHT30 | 80 |
| Enclosure | IP65 weatherproof + sun shield | 200 |
| Power Supply | 5V/2A USB adapter + cable | 100 |
| Antenna | External WiFi antenna (optional) | 150 |
| **Total per node** | | **~1,000 THB** |

### Firmware Flashing

```bash
# Install PlatformIO
pip install platformio

# Clone sensor firmware
cd examples/thailand-dashboard/esp32-firmware

# Configure WiFi and MQTT credentials
cp src/config.h.template src/config.h
# Edit src/config.h with your WiFi SSID, MQTT broker address, and device token

# Build and flash
pio run --target upload --upload-port /dev/ttyUSB0
```

### Network Topology

```
                    ┌─────────────────┐
                    │   WiFi / LoRa   │
                    │    Gateway      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐       ┌─────▼─────┐
   │ ESP32   │         │  ESP32    │       │  ESP32    │
   │ Node 1  │         │  Node 2   │       │  Node N   │
   │ (PM2.5) │         │ (Flood)   │       │ (Noise)   │
   └────┬────┘         └─────┬─────┘       └─────┬─────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Mosquitto MQTT │
                    │    Broker       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   ThingsBoard   │
                    │  (Rule Engine)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   (Telemetry)   │
                    └─────────────────┘
```

### Sensor Placement Guidelines

| Sensor Type | Height | Distance from Road | Density |
|-------------|--------|-------------------|---------|
| Air Quality | 3–4 meters | >10 meters | 1 per 2 km² |
| Noise | 1.2–1.5 meters | 2–5 meters | 1 per 1 km² |
| Flood Depth | 0.3 meters above ground | Low-lying area | 1 per flood-prone zone |
| Traffic Count | 5–6 meters | Roadside | 1 per major intersection |

---

## Cost Breakdown by Tier

### Small Tier (Sikhio): Monthly Operating Cost

| Item | Specification | Monthly Cost (THB) |
|------|--------------|-------------------|
| VPS (4 vCPU/8 GB) | Thai cloud provider | 1,200 |
| Storage (100 GB SSD) | Included with VPS | — |
| Domain + SSL | Let's Encrypt (free) + .go.th domain | 500 |
| Backup (S3-compatible) | 50 GB | 150 |
| Monitoring | UptimeRobot free tier | — |
| **Total Infrastructure** | | **1,850** |
| Sensors (initial 5) | ESP32 + PM2.5 + enclosure | 5,000 (one-time) |
| Maintenance | Sensor replacement (20%/year) | ~100/month |

**Annual Total**: ~27,000 THB (~750 USD)

### Medium Tier (Nakhon Si Thammarat): Monthly Operating Cost

| Item | Specification | Monthly Cost (THB) |
|------|--------------|-------------------|
| App Server (8 vCPU/16 GB) | Thai cloud provider | 3,500 |
| DB Server (4 vCPU/16 GB) | Dedicated instance | 4,000 |
| Object Storage (500 GB) | S3-compatible | 500 |
| CDN + WAF | Cloudflare Pro | 1,500 |
| Monitoring | DataDog or Grafana Cloud | 1,500 |
| **Total Infrastructure** | | **11,000** |
| Sensors (initial 15) | Mixed types | 15,000 (one-time) |
| LoRaWAN Gateway | Outdoor gateway | 15,000 (one-time) |

**Annual Total**: ~162,000 THB (~4,500 USD)

### Large Tier (Bangkok): Monthly Operating Cost

| Item | Specification | Monthly Cost (THB) |
|------|--------------|-------------------|
| K8s Cluster (3× 16 vCPU/32 GB) | Managed Kubernetes | 35,000 |
| DB Cluster (Primary + 2 Replicas) | 64 GB RAM each | 55,000 |
| Object Storage (2 TB) | S3 + lifecycle policies | 2,000 |
| CDN + WAF + DDoS | Cloudflare Business | 7,500 |
| Monitoring + Logging | Grafana Cloud + Loki | 5,000 |
| **Total Infrastructure** | | **104,500** |
| Sensors (100+ nodes) | City-wide deployment | 100,000 (one-time) |
| LoRaWAN Gateways (10) | City-wide coverage | 150,000 (one-time) |

**Annual Total**: ~1,504,000 THB (~42,000 USD)

---

*For municipality-specific deployment notes, see [THAILAND_MUNICIPALITIES.md](THAILAND_MUNICIPALITIES.md). For data source integration code, see [DATA_SOURCES.md](DATA_SOURCES.md).*
