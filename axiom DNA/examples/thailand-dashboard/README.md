# Thailand Dashboard Example

> A complete working example of an Axiom Framework dashboard configured for Thai municipalities. This example includes Grafana dashboard definitions, Metabase question templates, API query samples, and ESP32 sensor firmware.

---

## What's Included

| Directory | Contents |
|-----------|----------|
| `grafana/` | Dashboard JSON for importing into Grafana |
| `metabase/` | Sample SQL questions for Metabase |
| `api_queries/` | Python scripts for polling Thai data APIs |
| `esp32-firmware/` | Arduino/PlatformIO firmware for sensor nodes |

---

## Quick Start

### 1. Import Grafana Dashboard

1. Open Grafana at `http://your-server:3000`
2. Navigate to **Dashboards → Import**
3. Upload `grafana/dashboard.json`
4. Select the "MunicipalDB" PostgreSQL data source
5. The dashboard will appear under **Axiom → Thailand Overview**

### 2. Configure Metabase Questions

1. Open Metabase at `http://your-server:3002`
2. Add MunicipalDB as a data source
3. Go to **New → SQL Query**
4. Paste any question from `metabase/questions.sql`
5. Save and add to a dashboard

### 3. Run API Pollers

```bash
# Install dependencies
pip install requests psycopg2-binary python-dotenv

# Copy and configure environment
cp api_queries/.env.example api_queries/.env
# Edit api_queries/.env with your API keys

# Run individual pollers
python api_queries/air_quality_poller.py
python api_queries/traffy_poller.py
python api_queries/gtfs_poller.py
```

### 4. Flash ESP32 Sensors

```bash
cd esp32-firmware
# Install PlatformIO: pip install platformio
# Copy and edit configuration
cp src/config.h.template src/config.h
# Edit src/config.h with your WiFi and MQTT credentials

# Build and upload
pio run --target upload --upload-port /dev/ttyUSB0
```

---

## Dashboard Overview

The Thailand Overview dashboard displays:

- **Air Quality Map**: PM2.5 readings across all connected stations with color-coded markers
- **Traffic Status**: Congestion levels and incident counts by district
- **Environmental Panel**: Temperature, humidity, and rainfall trends
- **Alert Feed**: Real-time incident stream from Traffy Fondue and internal sensors
- **Municipality Summary**: KPI cards for each configured municipality

---

## Customization

To adapt this example for your municipality:

1. **Update municipality ID** in all SQL queries (replace `'sikhio'` with your municipality code)
2. **Add your sensors** to the `sensors` table with correct locations
3. **Configure API keys** in `api_queries/.env` for data sources you have access to
4. **Translate labels** in the Grafana dashboard JSON for Thai or other languages
5. **Add your logo** by replacing the panel with `id: "municipality_header"`

---

## Data Flow

```
External APIs (Air4Thai, Traffy, BMA)
    │
    ▼
┌──────────────┐
│ API Pollers  │  (Python scripts in api_queries/)
│ (Python)     │
└──────┬───────┘
       │  INSERT
       ▼
┌──────────────┐     ┌──────────────┐
│  PostgreSQL  │────▶│   Grafana    │
│ + TimescaleDB│     │ (Dashboard)  │
│ + PostGIS    │     └──────────────┘
└──────┬───────┘     ┌──────────────┘
       │             │
       │  INSERT     ▼
       │      ┌──────────────┐
       └─────▶│   Metabase   │
  (MQTT)      │ (Analytics)  │
       │      └──────────────┘
       ▼
┌──────────────┐
│   Sensors    │  (ESP32 firmware in esp32-firmware/)
│   (ESP32)    │
└──────────────┘
```

---

*For more details on the framework, see the main [README.md](../../README.md) and [docs/](../../docs/).*
