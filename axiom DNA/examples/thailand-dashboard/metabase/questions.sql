-- ============================================================================
-- Axiom Framework - Metabase Sample Questions
-- Copy these SQL queries into Metabase's SQL editor to create questions
-- for your Thailand municipal dashboard.
-- ============================================================================

-- ============================================================================
-- QUESTION 1: Air Quality Summary by Municipality
-- Type: Table
-- Visualization: Table with conditional formatting
-- ============================================================================

SELECT
    m.name_en AS municipality,
    m.name_th AS municipality_th,
    ROUND(AVG(CASE WHEN t.metric_name = 'pm25' AND t.time >= NOW() - INTERVAL '1 hour' THEN t.metric_value END)::numeric, 1) AS pm25_1h_avg,
    ROUND(AVG(CASE WHEN t.metric_name = 'pm10' AND t.time >= NOW() - INTERVAL '1 hour' THEN t.metric_value END)::numeric, 1) AS pm10_1h_avg,
    ROUND(AVG(CASE WHEN t.metric_name = 'temperature' AND t.time >= NOW() - INTERVAL '1 hour' THEN t.metric_value END)::numeric, 1) AS temp_c,
    COUNT(DISTINCT t.sensor_id) AS active_sensors,
    MAX(t.time) AS last_reading
FROM municipalities m
LEFT JOIN telemetry t ON m.id = t.municipality_id AND t.time >= NOW() - INTERVAL '24 hours'
WHERE m.active = TRUE
GROUP BY m.id, m.name_en, m.name_th
ORDER BY pm25_1h_avg DESC NULLS LAST;

-- ============================================================================
-- QUESTION 2: Monthly Incident Trends
-- Type: Timeseries
-- Visualization: Line chart
-- ============================================================================

SELECT
    DATE_TRUNC('month', created_at) AS month,
    incident_type,
    COUNT(*) AS incident_count
FROM incidents
WHERE created_at >= NOW() - INTERVAL '12 months'
  AND municipality_id = {{municipality_id}}
GROUP BY DATE_TRUNC('month', created_at), incident_type
ORDER BY month, incident_type;

-- ============================================================================
-- QUESTION 3: Sensor Uptime and Health
-- Type: Table
-- Visualization: Table with color coding for last_seen_at
-- ============================================================================

SELECT
    s.id AS sensor_id,
    s.name,
    s.source_type AS sensor_type,
    CASE
        WHEN s.last_seen_at >= NOW() - INTERVAL '5 minutes' THEN 'Online'
        WHEN s.last_seen_at >= NOW() - INTERVAL '1 hour' THEN 'Delayed'
        WHEN s.last_seen_at IS NULL THEN 'Never seen'
        ELSE 'Offline'
    END AS status,
    s.last_seen_at,
    ST_Y(s.location) AS latitude,
    ST_X(s.location) AS longitude,
    s.installed_at
FROM sensors s
WHERE s.municipality_id = {{municipality_id}}
  AND s.is_active = TRUE
ORDER BY s.last_seen_at DESC NULLS LAST;

-- ============================================================================
-- QUESTION 4: Daily PM2.5 Heatmap
-- Type: Timeseries
-- Visualization: Heatmap (or bar chart)
-- ============================================================================

SELECT
    time_bucket('1 day', time) AS date,
    sensor_id,
    ROUND(AVG(metric_value)::numeric, 1) AS avg_pm25
FROM telemetry
WHERE metric_name = 'pm25'
  AND municipality_id = {{municipality_id}}
  AND time >= NOW() - INTERVAL '30 days'
GROUP BY time_bucket('1 day', time), sensor_id
ORDER BY date, sensor_id;

-- ============================================================================
-- QUESTION 5: Flood Risk Assessment
-- Type: Table
-- Visualization: Table with severity indicators
-- ============================================================================

SELECT
    i.id,
    i.title_en AS location,
    i.incident_type,
    i.severity,
    i.status,
    i.created_at AS detected_at,
    ROUND(EXTRACT(EPOCH FROM (NOW() - i.created_at)) / 3600, 1) AS hours_open,
    ST_Y(i.location::geometry) AS lat,
    ST_X(i.location::geometry) AS lon
FROM incidents i
WHERE i.incident_type = 'flooding'
  AND i.municipality_id = {{municipality_id}}
  AND i.created_at >= NOW() - INTERVAL '7 days'
ORDER BY i.created_at DESC;

-- ============================================================================
-- QUESTION 6: Traffic Speed Distribution
-- Type: Summary
-- Visualization: Bar chart or pie chart
-- ============================================================================

SELECT
    CASE
        WHEN avg_speed >= 60 THEN 'Fast (>60 km/h)'
        WHEN avg_speed >= 40 THEN 'Moderate (40-60)'
        WHEN avg_speed >= 20 THEN 'Slow (20-40)'
        ELSE 'Congested (<20)'
    END AS speed_category,
    COUNT(*) AS road_segments,
    ROUND(AVG(avg_speed)::numeric, 1) AS average_speed
FROM (
    SELECT
        sensor_id,
        AVG(metric_value) AS avg_speed
    FROM telemetry
    WHERE metric_name = 'traffic_speed'
      AND municipality_id = {{municipality_id}}
      AND time >= NOW() - INTERVAL '1 hour'
    GROUP BY sensor_id
) speeds
GROUP BY speed_category
ORDER BY average_speed DESC;

-- ============================================================================
-- QUESTION 7: Weather Observations (Latest)
-- Type: Table
-- Visualization: Table
-- ============================================================================

SELECT
    station_id,
    temperature_c,
    humidity_pct,
    rainfall_mm,
    wind_speed_ms,
    wind_direction,
    time AS observed_at
FROM weather_observations
WHERE municipality_id = {{municipality_id}}
  AND time >= NOW() - INTERVAL '24 hours'
ORDER BY time DESC
LIMIT 10;

-- ============================================================================
-- QUESTION 8: Incident Resolution Performance
-- Type: Timeseries
-- Visualization: Line + bar combo
-- ============================================================================

SELECT
    DATE_TRUNC('week', created_at) AS week,
    COUNT(*) AS total_reported,
    COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END) AS resolved,
    ROUND(
        COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END)::numeric * 100 / NULLIF(COUNT(*), 0),
        1
    ) AS resolution_rate_pct,
    ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at)) / 3600)::numeric, 1) AS avg_resolution_hours
FROM incidents
WHERE municipality_id = {{municipality_id}}
  AND created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week;

-- ============================================================================
-- VARIABLES DEFINITION
-- These are Metabase template variables. When you paste into Metabase,
-- it will auto-detect {{municipality_id}} and prompt you to configure:
--
-- Variable: municipality_id
-- Type: Text
-- Default value: sikhio
-- Required: Yes
--
-- You can also change it to a "Field Filter" connected to the
-- municipalities.id column for a dropdown selector.
-- ============================================================================
