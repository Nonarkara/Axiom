-- ============================================================================
-- Axiom Framework - Database Initialization Script
-- Creates: extensions, roles, schemas, tables, indexes, and seed data
-- Compatible with: PostgreSQL 15 + PostGIS 3.4 + TimescaleDB 2.14
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- ROLES
-- ============================================================================

-- Grafana read-only user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'grafana') THEN
        CREATE ROLE grafana WITH LOGIN PASSWORD 'grafana_change_me';
    END IF;
END
$$;

-- Metabase application user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'metabase') THEN
        CREATE ROLE metabase WITH LOGIN PASSWORD 'metabase_change_me';
    END IF;
END
$$;

-- ThingsBoard IoT user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'thingsboard') THEN
        CREATE ROLE thingsboard WITH LOGIN PASSWORD 'thingsboard_change_me';
    END IF;
END
$$;

-- Kong API Gateway user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'kong') THEN
        CREATE ROLE kong WITH LOGIN PASSWORD 'kong_change_me';
    END IF;
END
$$;

-- Poller / data ingestion user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'poller') THEN
        CREATE ROLE poller WITH LOGIN PASSWORD 'poller_change_me';
    END IF;
END
$$;

-- ============================================================================
-- DATABASES
-- ============================================================================

-- Grafana configuration database
CREATE DATABASE grafana OWNER grafana ENCODING 'UTF8';

-- Metabase application database
CREATE DATABASE metabase OWNER metabase ENCODING 'UTF8';

-- ThingsBoard database
CREATE DATABASE thingsboard OWNER thingsboard ENCODING 'UTF8';

-- Kong database
CREATE DATABASE kong OWNER kong ENCODING 'UTF8';

-- ============================================================================
-- SCHEMAS (in municipal database)
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS geodata;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT CONNECT ON DATABASE municipal TO grafana;
GRANT CONNECT ON DATABASE municipal TO metabase;
GRANT CONNECT ON DATABASE municipal TO poller;
GRANT USAGE ON SCHEMA public TO grafana;
GRANT USAGE ON SCHEMA public TO metabase;
GRANT USAGE ON SCHEMA public TO poller;
GRANT USAGE ON SCHEMA staging TO poller;
GRANT USAGE ON SCHEMA analytics TO grafana;
GRANT USAGE ON SCHEMA analytics TO metabase;
GRANT USAGE ON SCHEMA geodata TO grafana;
GRANT USAGE ON SCHEMA geodata TO metabase;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO grafana;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO poller;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA staging TO poller;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO grafana;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO metabase;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO poller;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA staging TO poller;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO grafana;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO poller;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO poller;

-- ============================================================================
-- REFERENCE TABLES
-- ============================================================================

-- Municipalities master table
CREATE TABLE IF NOT EXISTS municipalities (
    id              TEXT PRIMARY KEY,
    name_th         TEXT NOT NULL,
    name_en         TEXT NOT NULL,
    province_code   TEXT NOT NULL,
    province_name   TEXT NOT NULL,
    municipality_type TEXT NOT NULL CHECK (municipality_type IN (
        'thesaban_nakhon', 'thesaban_mueang', 'thesaban_tambon',
        'tambon_admin_org', 'special', 'university', 'private'
    )),
    population      INTEGER,
    area_km2        NUMERIC(10, 2),
    boundary        GEOMETRY(MULTIPOLYGON, 4326),
    centroid        GEOMETRY(POINT, 4326),
    sia_zone        TEXT,  -- Special Investment Area, if applicable
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_municipalities_boundary ON municipalities USING GIST(boundary);
CREATE INDEX idx_municipalities_type ON municipalities(municipality_type);

-- Sensors / data sources registry
CREATE TABLE IF NOT EXISTS sensors (
    id              TEXT PRIMARY KEY,
    municipality_id TEXT REFERENCES municipalities(id) ON DELETE CASCADE,
    source_type     TEXT NOT NULL CHECK (source_type IN (
        'pm25', 'pm10', 'temperature', 'humidity', 'noise_db',
        'traffic_speed', 'traffic_count', 'vehicle_count',
        'passenger_count', 'flood_depth', 'water_level',
        'power_usage', 'energy_consumption', 'co2',
        'wind_speed', 'wind_direction', 'rainfall',
        'occupancy', 'cctv', 'generic'
    )),
    protocol        TEXT NOT NULL CHECK (protocol IN ('mqtt', 'http', 'https', 'gtfs_rt', 'webhook', 'modbus', 'lorawan')),
    location        GEOMETRY(POINT, 4326),
    altitude_m      NUMERIC(8, 2),
    name            TEXT,
    description     TEXT,
    device_token    TEXT,  -- For ThingsBoard MQTT auth
    config_json     JSONB DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,
    installed_at    TIMESTAMPTZ,
    last_seen_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sensors_location ON sensors USING GIST(location);
CREATE INDEX idx_sensors_municipality ON sensors(municipality_id);
CREATE INDEX idx_sensors_type ON sensors(source_type);
CREATE INDEX idx_sensors_active ON sensors(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- CORE TELEMETRY TABLE (TimescaleDB Hypertable)
-- ============================================================================

CREATE TABLE IF NOT EXISTS telemetry (
    time            TIMESTAMPTZ NOT NULL,
    source_id       TEXT NOT NULL,
    sensor_id       TEXT REFERENCES sensors(id),
    municipality_id TEXT NOT NULL REFERENCES municipalities(id),
    location        GEOGRAPHY(POINT, 4326),
    metric_name     TEXT NOT NULL,
    metric_value    DOUBLE PRECISION NOT NULL,
    unit            TEXT,
    quality_flag    TEXT DEFAULT 'validated' CHECK (quality_flag IN ('raw', 'validated', 'corrected', 'suspect', 'missing')),
    metadata_json   JSONB DEFAULT '{}'
);

-- Convert to hypertable (time-based partitioning)
SELECT create_hypertable('telemetry', 'time', 
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Add space dimension for multi-municipality query performance
SELECT add_dimension('telemetry', 'municipality_id', 4, if_not_exists => TRUE);

-- Primary indexes
CREATE INDEX idx_telemetry_sensor_time ON telemetry(sensor_id, time DESC);
CREATE INDEX idx_telemetry_metric ON telemetry(metric_name, time DESC);
CREATE INDEX idx_telemetry_location ON telemetry USING GIST(location);
CREATE INDEX idx_telemetry_quality ON telemetry(quality_flag) WHERE quality_flag != 'validated';

-- Partial indexes for common queries
CREATE INDEX idx_telemetry_recent_pm25 ON telemetry(municipality_id, time DESC) 
    WHERE metric_name = 'pm25';
CREATE INDEX idx_telemetry_recent_traffic ON telemetry(municipality_id, time DESC)
    WHERE metric_name IN ('traffic_speed', 'traffic_count', 'vehicle_count');

-- Continuous aggregates for fast dashboard queries
CREATE MATERIALIZED VIEW IF NOT EXISTS telemetry_hourly
WITH (timescaledb.continuous) AS
SELECT
    municipality_id,
    sensor_id,
    metric_name,
    time_bucket('1 hour', time) AS bucket,
    AVG(metric_value) AS avg_value,
    MIN(metric_value) AS min_value,
    MAX(metric_value) AS max_value,
    COUNT(*) AS sample_count,
    LAST(metric_value, time) AS latest_value,
    LAST(unit, time) AS unit
FROM telemetry
GROUP BY municipality_id, sensor_id, metric_name, bucket;

CREATE MATERIALIZED VIEW IF NOT EXISTS telemetry_daily
WITH (timescaledb.continuous) AS
SELECT
    municipality_id,
    sensor_id,
    metric_name,
    time_bucket('1 day', time) AS bucket,
    AVG(metric_value) AS avg_value,
    MIN(metric_value) AS min_value,
    MAX(metric_value) AS max_value,
    COUNT(*) AS sample_count
FROM telemetry
GROUP BY municipality_id, sensor_id, metric_name, bucket;

-- Refresh policies (real-time for hourly, daily at midnight)
SELECT add_continuous_aggregate_policy('telemetry_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour'
);

SELECT add_continuous_aggregate_policy('telemetry_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day'
);

-- ============================================================================
-- INCIDENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS incidents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id       TEXT NOT NULL,
    external_id     TEXT,
    municipality_id TEXT NOT NULL REFERENCES municipalities(id),
    location        GEOGRAPHY(POINT, 4326),
    incident_type   TEXT NOT NULL CHECK (incident_type IN (
        'flooding', 'traffic_accident', 'road_damage', 'power_outage',
        'fire', 'pollution', 'noise_complaint', 'waste_issue',
        'crime', 'public_health', 'infrastructure', 'other'
    )),
    severity        TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title_th        TEXT,
    title_en        TEXT,
    description     TEXT,
    status          TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'resolved', 'closed')),
    reported_by     TEXT,
    assigned_to     TEXT,
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    photo_urls      TEXT[],
    metadata_json   JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('incidents', 'created_at',
    chunk_time_interval => INTERVAL '1 month',
    if_not_exists => TRUE
);

CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX idx_incidents_municipality ON incidents(municipality_id);
CREATE INDEX idx_incidents_type ON incidents(incident_type);
CREATE INDEX idx_incidents_status ON incidents(status) WHERE status NOT IN ('resolved', 'closed');
CREATE INDEX idx_incidents_severity ON incidents(severity);

-- ============================================================================
-- INFRASTRUCTURE / GEOGRAPHIC FEATURES
-- ============================================================================

CREATE TABLE IF NOT EXISTS infrastructure (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id TEXT NOT NULL REFERENCES municipalities(id),
    feature_type    TEXT NOT NULL CHECK (feature_type IN (
        'road', 'intersection', 'building', 'bridge', 'canal',
        'drain', 'park', 'school', 'hospital', 'market',
        'bus_stop', 'railway_station', 'landfill', 'pump_station',
        'substation', 'street_light', 'cctv', 'siren'
    )),
    name_th         TEXT,
    name_en         TEXT,
    geometry        GEOMETRY(GEOMETRY, 4326),
    centroid        GEOMETRY(POINT, 4326),
    attributes_json JSONB DEFAULT '{}',
    source          TEXT,
    source_id       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_infrastructure_geom ON infrastructure USING GIST(geometry);
CREATE INDEX idx_infrastructure_type ON infrastructure(feature_type);
CREATE INDEX idx_infrastructure_municipality ON infrastructure(municipality_id);

-- ============================================================================
-- GTFS TRANSIT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS transit_agencies (
    agency_id       TEXT PRIMARY KEY,
    agency_name     TEXT NOT NULL,
    agency_url      TEXT,
    agency_timezone TEXT DEFAULT 'Asia/Bangkok',
    agency_lang     TEXT DEFAULT 'th',
    agency_phone    TEXT,
    feed_version    TEXT
);

CREATE TABLE IF NOT EXISTS transit_routes (
    route_id        TEXT PRIMARY KEY,
    agency_id       TEXT REFERENCES transit_agencies(agency_id),
    route_short_name TEXT NOT NULL,
    route_long_name  TEXT,
    route_type      INTEGER NOT NULL,  -- 0=tram, 1=subway, 2=rail, 3=bus, 4=ferry
    route_color     TEXT,
    route_text_color TEXT
);

CREATE TABLE IF NOT EXISTS transit_stops (
    stop_id         TEXT PRIMARY KEY,
    stop_name_th    TEXT,
    stop_name_en    TEXT,
    stop_lat        NUMERIC(10, 8) NOT NULL,
    stop_lon        NUMERIC(11, 8) NOT NULL,
    location_type   INTEGER DEFAULT 0,  -- 0=stop, 1=station
    parent_station  TEXT,
    wheelchair_boarding INTEGER DEFAULT 0,
    geometry        GEOMETRY(POINT, 4326)
);

CREATE INDEX idx_transit_stops_geom ON transit_stops USING GIST(geometry);

-- ============================================================================
-- WEATHER / ENVIRONMENTAL TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS weather_observations (
    time            TIMESTAMPTZ NOT NULL,
    station_id      TEXT NOT NULL,
    municipality_id TEXT REFERENCES municipalities(id),
    location        GEOGRAPHY(POINT, 4326),
    temperature_c   NUMERIC(5, 2),
    humidity_pct    NUMERIC(5, 2),
    pressure_hpa    NUMERIC(7, 2),
    wind_speed_ms   NUMERIC(5, 2),
    wind_direction  NUMERIC(5, 2),
    rainfall_mm     NUMERIC(6, 2),
    visibility_m    INTEGER,
    cloud_cover_pct NUMERIC(5, 2),
    source          TEXT,
    metadata_json   JSONB DEFAULT '{}'
);

SELECT create_hypertable('weather_observations', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

CREATE INDEX idx_weather_station_time ON weather_observations(station_id, time DESC);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Current sensor readings (latest per sensor)
CREATE OR REPLACE VIEW analytics.sensor_latest AS
SELECT DISTINCT ON (sensor_id)
    t.sensor_id,
    s.source_type AS sensor_type,
    s.municipality_id,
    m.name_en AS municipality_name,
    t.metric_name,
    t.metric_value AS latest_value,
    t.unit,
    t.time AS last_reading_at,
    t.location
FROM telemetry t
JOIN sensors s ON t.sensor_id = s.id
JOIN municipalities m ON t.municipality_id = m.id
ORDER BY t.sensor_id, t.time DESC;

-- Municipality summary dashboard view
CREATE OR REPLACE VIEW analytics.municipality_summary AS
SELECT
    m.id AS municipality_id,
    m.name_en,
    m.name_th,
    m.population,
    m.area_km2,
    COUNT(DISTINCT s.id) AS active_sensors,
    COUNT(DISTINCT i.id) AS open_incidents,
    (SELECT AVG(metric_value) FROM telemetry 
     WHERE municipality_id = m.id AND metric_name = 'pm25' 
     AND time > NOW() - INTERVAL '1 hour') AS current_pm25,
    (SELECT AVG(metric_value) FROM telemetry
     WHERE municipality_id = m.id AND metric_name = 'traffic_speed'
     AND time > NOW() - INTERVAL '1 hour') AS avg_traffic_speed,
    m.centroid
FROM municipalities m
LEFT JOIN sensors s ON m.id = s.municipality_id AND s.is_active = TRUE
LEFT JOIN incidents i ON m.id = i.municipality_id AND i.status NOT IN ('resolved', 'closed')
GROUP BY m.id, m.name_en, m.name_th, m.population, m.area_km2, m.centroid;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert sample municipalities
INSERT INTO municipalities (id, name_th, name_en, province_code, province_name, municipality_type, population, area_km2)
VALUES
    ('sikhio', 'เทศบาลเมืองสีคิ้ว', 'Sikhio Town Municipality', '30', 'Nakhon Ratchasima', 'thesaban_mueang', 22000, 6.8),
    ('yala_city', 'เทศบาลนครยะลา', 'Yala City Municipality', '95', 'Yala', 'thesaban_nakhon', 62000, 19.4),
    ('nakhon_si', 'เทศบาลนครนครศรีธรรมราช', 'Nakhon Si Thammarat City Municipality', '80', 'Nakhon Si Thammarat', 'thesaban_nakhon', 105000, 22.6),
    ('kmitl', 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 'KMITL', '10', 'Bangkok', 'university', 25000, 3.8),
    ('chula', 'จุฬาลงกรณ์มหาวิทยาลัย', 'Chulalongkorn University', '10', 'Bangkok', 'university', 40000, 1.6),
    ('muang_thong', 'เมืองทองธานี', 'Muang Thong Thani', '12', 'Nonthaburi', 'private', 150000, 8.0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample sensors
INSERT INTO sensors (id, municipality_id, source_type, protocol, location, name, description, is_active)
VALUES
    ('sikhio_pm25_001', 'sikhio', 'pm25', 'mqtt', ST_SetSRID(ST_MakePoint(101.366, 14.892), 4326), 'Sikhio Municipality Office', 'Primary PM2.5 monitoring station', TRUE),
    ('sikhio_weather_001', 'sikhio', 'temperature', 'mqtt', ST_SetSRID(ST_MakePoint(101.366, 14.892), 4326), 'Sikhio Weather Station', 'Temperature, humidity, rainfall', TRUE),
    ('yala_pm25_001', 'yala_city', 'pm25', 'mqtt', ST_SetSRID(ST_MakePoint(101.689, 6.551), 4326), 'Yala City Center', 'PM2.5 + meteorological', TRUE),
    ('yala_flood_001', 'yala_city', 'water_level', 'mqtt', ST_SetSRID(ST_MakePoint(101.680, 6.545), 4326), 'Sateng Canal Level', 'Flood early warning sensor', TRUE),
    ('nakhon_si_pm25_001', 'nakhon_si', 'pm25', 'mqtt', ST_SetSRID(ST_MakePoint(99.965, 8.432), 4326), 'Nakhon Si Thammarat Center', 'Primary air quality station', TRUE),
    ('nakhon_si_flood_001', 'nakhon_si', 'water_level', 'mqtt', ST_SetSRID(ST_MakePoint(99.970, 8.430), 4326), 'Pak Nakhon River', 'River level monitoring', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RETENTION POLICY
-- ============================================================================

-- Automatically drop raw telemetry older than 1 year (adjust per tier)
SELECT add_retention_policy('telemetry', INTERVAL '1 year', if_not_exists => TRUE);
SELECT add_retention_policy('weather_observations', INTERVAL '2 years', if_not_exists => TRUE);

-- Keep continuous aggregates longer
SELECT add_retention_policy('telemetry_hourly', INTERVAL '3 years', if_not_exists => TRUE);
SELECT add_retention_policy('telemetry_daily', INTERVAL '7 years', if_not_exists => TRUE);

-- ============================================================================
-- NOTIFICATION FUNCTION (for real-time alerts)
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_telemetry_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify on high PM2.5 values (> 75 µg/m³, Thai NAAQS)
    IF NEW.metric_name = 'pm25' AND NEW.metric_value > 75 THEN
        PERFORM pg_notify('telemetry_alert', json_build_object(
            'sensor_id', NEW.sensor_id,
            'metric', NEW.metric_name,
            'value', NEW.metric_value,
            'threshold', 75,
            'timestamp', NEW.time
        )::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER telemetry_alert_trigger
    AFTER INSERT ON telemetry
    FOR EACH ROW
    EXECUTE FUNCTION notify_telemetry_insert();

-- ============================================================================
-- GRANT ADDITIONAL PERMISSIONS ON NEW OBJECTS
-- ============================================================================

GRANT SELECT ON analytics.sensor_latest TO grafana;
GRANT SELECT ON analytics.municipality_summary TO grafana;
GRANT SELECT ON analytics.sensor_latest TO metabase;
GRANT SELECT ON analytics.municipality_summary TO metabase;
GRANT SELECT, INSERT, UPDATE ON telemetry TO poller;
GRANT SELECT, INSERT, UPDATE ON incidents TO poller;
GRANT SELECT, INSERT, UPDATE ON weather_observations TO poller;
GRANT SELECT, INSERT, UPDATE ON sensors TO poller;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO poller;

-- ============================================================================
-- COMPLETION
-- ============================================================================

SELECT 'Axiom Framework database initialized successfully' AS status;
