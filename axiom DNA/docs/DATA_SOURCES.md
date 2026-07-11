# Data Sources Directory

> A comprehensive directory of all data sources integrated into the Axiom Framework, with authentication details, endpoint specifications, and code examples for each source.

---

## Table of Contents

- [Thailand National Data Sources](#thailand-national-data-sources)
- [Bangkok Metropolitan Sources](#bangkok-metropolitan-sources)
- [Transit APIs](#transit-apis)
- [Environmental Data](#environmental-data)
- [Municipal & Administrative Sources](#municipal--administrative-sources)
- [International Open Data](#international-open-data)

---

## Thailand National Data Sources

### Data.go.th

Thailand's national open data portal, maintained by the Digital Government Development Agency (DGA). Contains over 3,000 datasets across all government ministries.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.go.th |
| **API Base** | https://opend.data.go.th |
| **Authentication** | API Key (free registration) |
| **Format** | JSON, CSV, XML |
| **Update Frequency** | Varies by dataset (daily to annual) |
| **Rate Limit** | 1,000 requests/day (free tier) |

```python
import requests

API_KEY = "your_api_key"
BASE_URL = "https://opend.data.go.th/api/3"

def search_datasets(query):
    """Search for datasets on data.go.th"""
    response = requests.get(
        f"{BASE_URL}/action/package_search",
        headers={"api-key": API_KEY},
        params={"q": query, "rows": 20}
    )
    return response.json()["result"]["results"]

def get_dataset_resource(resource_id):
    """Fetch a specific dataset resource"""
    response = requests.get(
        f"{BASE_URL}/action/datastore_search",
        headers={"api-key": API_KEY},
        params={"resource_id": resource_id, "limit": 100}
    )
    return response.json()["result"]["records"]

# Example: Search for population data
results = search_datasets("ประชากร population")
for ds in results:
    print(f"{ds['title']}: {ds['name']}")
```

**Recommended Datasets**:
- `population_by_province` - NSO population statistics
- `household_income` - Household socio-economic surveys
- `government_spending` - Fiscal disbursement by ministry

---

### GISTDA (Geo-Informatics and Space Technology Development Agency)

Thailand's national geospatial data authority. Provides satellite imagery, topographic maps, boundary files, and flood monitoring.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.gistda.or.th |
| **API Base** | https://api.gistda.or.th |
| **Authentication** | OAuth 2.0 + API Key |
| **Format** | GeoJSON, Shapefile, GeoTIFF, WMS |
| **Update Frequency** | Real-time (satellite), quarterly (boundaries) |

```python
import requests

GISTDA_TOKEN = "your_oauth_token"

def get_flood_radar():
    """Fetch real-time flood radar from Thai satellite constellation"""
    response = requests.get(
        "https://api.gistda.or.th/flood/radar/latest",
        headers={"Authorization": f"Bearer {GISTDA_TOKEN}"}
    )
    data = response.json()
    return data["features"]  # GeoJSON FeatureCollection

def get_province_boundary(province_code):
    """Get administrative boundary as GeoJSON"""
    response = requests.get(
        f"https://api.gistda.or.th/admin/boundary/{province_code}",
        headers={"Authorization": f"Bearer {GISTDA_TOKEN}"}
    )
    return response.json()

# Example: Get Bangkok flood status (province code: 10)
floods = get_flood_radar()
for feature in floods:
    severity = feature["properties"]["flood_severity"]
    area_km2 = feature["properties"]["flooded_area_km2"]
    print(f"Severity {severity}: {area_km2} km² flooded")
```

**Key GISTDA Services**:
- **Thaichote Satellite Imagery**: 2-meter resolution optical imagery
- **Flood Monitoring System**: SAR-based flood detection updated every 6–12 hours during events
- **GeoPortal WMS**: Web Map Service for base maps and overlays
- **Administrative Boundaries**: Province, district, sub-district boundaries (GEOJSON/Shapefile)

---

### NSO (National Statistical Office)

Thailand's official statistics agency. Provides census data, labor force surveys, household socio-economic data, and municipal-level indicators.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.nso.go.th |
| **Data Portal** | https://statbbi.nso.go.th/staticreport |
| **Authentication** | None required (public data) |
| **Format** | Excel, PDF, CSV, SDMX |
| **Update Frequency** | Annual (census), quarterly (labor force) |

```python
import pandas as pd

def load_municipal_population():
    """Load municipal-level population statistics from NSO"""
    # NSO provides bulk download URLs for published datasets
    url = "https://statbbi.nso.go.th/staticreport/Excelreport.aspx?report=10"
    df = pd.read_excel(url, skiprows=3)
    
    # Clean and normalize
    df.columns = ["province_code", "province", "municipality", 
                  "total_pop", "male_pop", "female_pop", "households"]
    df = df.dropna(subset=["municipality"])
    return df

# Example: Find municipalities with population > 50,000
df = load_municipal_population()
large_muni = df[df["total_pop"] > 50000].sort_values("total_pop", ascending=False)
print(large_muni[["municipality", "total_pop"]].head(10))
```

---

### DOPA (Department of Provincial Administration)

Maintains the official population registry and administrative boundary data for all 8,775 sub-districts (tambon) in Thailand.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.dopa.go.th |
| **API Base** | Not publicly available; data via data.go.th |
| **Authentication** | Government only (direct API) |
| **Format** | CSV, JSON (via data.go.th) |
| **Update Frequency** | Monthly (population movement) |

**Access Pattern**: DOPA data is primarily accessed through the `data.go.th` portal using dataset IDs. For municipal dashboards, the most useful dataset is the **monthly population summary by sub-district**, which enables per-area demographic analysis when joined with GISTDA boundary files.

---

### TPMAP (Thailand Poverty Map)

Academic poverty mapping initiative providing sub-district-level poverty estimates based on machine learning models using satellite imagery and survey data.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.tpmap.in.th |
| **API Base** | https://api.tpmap.in.th |
| **Authentication** | Free API key |
| **Format** | GeoJSON, CSV |
| **Update Frequency** | Annual |

```python
def get_poverty_estimate(district_code):
    """Fetch poverty estimate for a sub-district"""
    response = requests.get(
        f"https://api.tpmap.in.th/poverty/{district_code}",
        headers={"X-API-Key": TPMAP_KEY}
    )
    data = response.json()
    return {
        "poverty_rate": data["poor_pct"],
        "vulnerability_index": data["vuln_index"],
        "confidence": data["model_confidence"]
    }
```

---

### GD Catalog (Government Data Catalog)

DGA's metadata catalog indexing all government datasets across ministries. Useful for discovering datasets not yet published on data.go.th.

| Attribute | Value |
|-----------|-------|
| **URL** | https://catalog.gd.go.th |
| **API** | CSW 2.0.2 (OGC Catalog Service) |
| **Authentication** | None |
| **Format** | XML (CSW), JSON |

---

## Bangkok Metropolitan Sources

### BMA Open Data

Bangkok Metropolitan Administration's open data portal. Contains traffic, public health, waste management, and budget execution data.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.bangkok.go.th |
| **API Base** | https://api.bangkok.go.th |
| **Authentication** | API Key |
| **Format** | JSON, CSV, GeoJSON |
| **Update Frequency** | Daily (traffic), monthly (budget) |

```python
BMA_API_KEY = "your_bma_key"

def get_traffic_volumes():
    """Fetch latest traffic volume counts by intersection"""
    response = requests.get(
        "https://api.bangkok.go.traffic/v1/volumes",
        headers={"Authorization": f"Bearer {BMA_API_KEY}"}
    )
    return response.json()["data"]

def get_waste_collection_routes():
    """Get waste truck GPS traces and collection points"""
    response = requests.get(
        "https://api.bangkok.go.th/environment/waste/routes",
        headers={"Authorization": f"Bearer {BMA_API_KEY}"}
    )
    return response.json()
```

---

### BMATraffic

BMA's real-time traffic information system with CCTV snapshots and congestion indices.

| Attribute | Value |
|-----------|-------|
| **URL** | https://traffic.bangkok.go.th |
| **API Base** | https://api.bangkok.go.th/traffic |
| **Authentication** | API Key (request from BMA IT) |
| **Format** | JSON, JPEG (CCTV), GeoJSON |
| **Update Frequency** | Real-time (1-minute CCTV refresh) |

```python
def get_cctv_feeds():
    """Get list of CCTV cameras with current image URLs"""
    response = requests.get(
        "https://api.bangkok.go.th/traffic/cctv",
        headers={"Authorization": f"Bearer {BMA_API_KEY}"}
    )
    cameras = response.json()["cameras"]
    return [
        {
            "id": c["camera_id"],
            "location": (c["latitude"], c["longitude"]),
            "image_url": c["latest_image_url"],
            "road_name": c["road_name_th"]
        }
        for c in cameras
    ]
```

---

### Traffy Fondue

Crowdsourced road incident reporting platform used extensively across Thailand. Citizens report potholes, flooding, broken signals, and accidents via Line app.

| Attribute | Value |
|-----------|-------|
| **URL** | https://fondue.in.th |
| **API Base** | https://api.traffy.in.th |
| **Authentication** | API Key |
| **Format** | JSON, GeoJSON |
| **Update Frequency** | Real-time (as reports are submitted) |

```python
TRAFFY_API_KEY = "your_traffy_key"

def get_recent_incidents(hours=24, bbox=None):
    """Fetch recent road incident reports"""
    params = {"hours": hours}
    if bbox:
        params["bbox"] = ",".join(map(str, bbox))  # minx,miny,maxx,maxy
    
    response = requests.get(
        "https://api.traffy.in.th/v1/incidents",
        headers={"X-API-Key": TRAFFY_API_KEY},
        params=params
    )
    
    incidents = response.json()["features"]
    return [
        {
            "id": i["properties"]["id"],
            "type": i["properties"]["type"],  # e.g., "flooding", "pothole"
            "status": i["properties"]["state"],  # "reported", "in_progress", "resolved"
            "timestamp": i["properties"]["timestamp"],
            "location": i["geometry"]["coordinates"],
            "photo_url": i["properties"].get("photo_url"),
            "description": i["properties"]["detail"]
        }
        for i in incidents
    ]

# Example: Get incidents in Bangkok city center
bangkok_bbox = [100.4, 13.6, 100.6, 13.9]
incidents = get_recent_incidents(hours=24, bbox=bangkok_bbox)
print(f"Found {len(incidents)} incidents in the last 24 hours")
```

---

### Air4Thai

Pollution Control Department's official air quality monitoring network. 50+ stations nationwide with PM2.5, PM10, O3, NO2, SO2, CO.

| Attribute | Value |
|-----------|-------|
| **URL** | https://air4thai.pcd.go.th |
| **API Base** | https://air4thai.pcd.go.th/services |
| **Authentication** | None required |
| **Format** | JSON |
| **Update Frequency** | Hourly |
| **Stations** | 50+ nationwide |

```python
def get_current_aqi():
    """Fetch current AQI from all stations"""
    response = requests.get(
        "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
        timeout=30
    )
    return response.json()["stations"]

def get_station_history(station_id, date_from, date_to):
    """Fetch historical data for a specific station"""
    response = requests.get(
        "https://air4thai.pcd.go.th/services/getDataHistory.php",
        params={
            "stationID": station_id,
            "param": "PM25,PM10,O3,NO2,SO2,CO",
            "startDate": date_from,
            "endDate": date_to,
            "type": "json"
        }
    )
    return response.json()

# Example: Current PM2.5 across all stations
stations = get_current_aqi()
for s in stations:
    pm25 = s["AQILast"]["PM25"]["value"]
    aqi = s["AQILast"]["AQI"]["aqi"]
    print(f"{s['nameTH']}: PM2.5 = {pm25} µg/m³, AQI = {aqi}")
```

---

## Transit APIs

### BTS (Bangkok Mass Transit System)

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.bts.co.th |
| **GTFS Static** | Available via DLT (Department of Land Transport) |
| **GTFS Realtime** | Limited availability (partner access) |
| **Format** | GTFS, JSON |

```python
def load_bts_gtfs():
    """Load BTS routes and stops from GTFS"""
    import zipfile, io
    
    url = "https://dlt.go.th/download/bts-gtfs.zip"
    response = requests.get(url)
    z = zipfile.ZipFile(io.BytesIO(response.content))
    
    routes = pd.read_csv(z.open("routes.txt"))
    stops = pd.read_csv(z.open("stops.txt"))
    return routes, stops
```

---

### MRT (Mass Rapid Transit Authority)

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.mrta.co.th |
| **GTFS** | Via BMN (Bangkok Metro Network) unified feed |
| **Real-time API** | https://api.bematransit.com |
| **Authentication** | API Key |

---

### SRT (State Railway of Thailand)

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.railway.co.th |
| **GTFS** | Available via OpenRailwayMap |
| **Real-time** | Limited (schedule only) |

---

### ARL (Airport Rail Link)

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.srtet.com |
| **GTFS** | Included in unified Bangkok GTFS |

---

### Unified GTFS Realtime (BMATraffic)

BMA provides a unified GTFS-RT feed combining BTS, MRT, and bus data.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.bmatraffic.com/feeds/gtfs-rt |
| **Authentication** | Bearer Token |
| **Format** | Protocol Buffers (GTFS-RT) |
| **Entities** | VehiclePosition, TripUpdate, Alert |

```python
from google.transit import gtfs_realtime_pb2

def get_gtfs_realtime():
    """Fetch unified Bangkok GTFS-RT feed"""
    response = requests.get(
        "https://data.bmatraffic.com/feeds/gtfs-rt",
        headers={"Authorization": f"Bearer {BMA_API_KEY}"}
    )
    
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    
    vehicles = []
    for entity in feed.entity:
        if entity.HasField("vehicle"):
            v = entity.vehicle
            vehicles.append({
                "trip_id": v.trip.trip_id,
                "route_id": v.trip.route_id,
                "latitude": v.position.latitude,
                "longitude": v.position.longitude,
                "bearing": v.position.bearing,
                "speed": v.position.speed,
                "timestamp": v.timestamp
            })
    return vehicles
```

---

## Environmental Data

### WAQI (World Air Quality Index)

Global air quality aggregator with stations worldwide. Useful for border areas and regional comparison.

| Attribute | Value |
|-----------|-------|
| **URL** | https://waqi.info |
| **API Base** | https://api.waqi.info |
| **Authentication** | API Token (free tier available) |
| **Format** | JSON |
| **Update Frequency** | Hourly |

```python
WAQI_TOKEN = "your_waqi_token"

def get_waqi_by_city(city_name):
    """Fetch AQI for a specific city"""
    response = requests.get(
        f"https://api.waqi.info/feed/{city_name}/",
        params={"token": WAQI_TOKEN}
    )
    data = response.json()["data"]
    return {
        "aqi": data["aqi"],
        "pm25": data["iaqi"].get("pm25", {}).get("v"),
        "temperature": data["iaqi"].get("t", {}).get("v"),
        "humidity": data["iaqi"].get("h", {}).get("v"),
        "station": data["city"]["name"]
    }
```

---

### GISTDA Flood Monitoring

Satellite-based flood detection using SAR (Synthetic Aperture Radar) from the Thai Chot satellite constellation and international partners.

| Attribute | Value |
|-----------|-------|
| **URL** | https://flood.gistda.or.th |
| **API** | WMS + REST |
| **Authentication** | GISTDA API Key |
| **Format** | GeoTIFF, GeoJSON, WMS |
| **Update Frequency** | Every 6–12 hours during flood events |

```python
def get_flood_alerts():
    """Get active flood alerts with affected area polygons"""
    response = requests.get(
        "https://flood.gistda.or.th/api/alerts/active",
        headers={"Authorization": f"Bearer {GISTDA_TOKEN}"}
    )
    alerts = response.json()["alerts"]
    return [
        {
            "id": a["alert_id"],
            "severity": a["severity_level"],  # 1-4
            "affected_area_km2": a["area_km2"],
            "geometry": a["geometry"],  # GeoJSON Polygon
            "detected_at": a["detection_timestamp"],
            "confidence": a["confidence_score"]
        }
        for a in alerts
    ]
```

---

### CHIRPS Rainfall

Climate Hazards Group InfraRed Precipitation with Station data. Global satellite-derived rainfall estimates at 0.05-degree resolution.

| Attribute | Value |
|-----------|-------|
| **URL** | https://chc.ucsb.edu/data/chirps |
| **API** | Google Earth Engine or direct download |
| **Authentication** | None (public domain data) |
| **Format** | GeoTIFF, NetCDF |
| **Update Frequency** | Daily (pentad and monthly aggregates available) |
| **Historical Range** | 1981–present |

```python
import xarray as xr

def load_chirps_daily(date, bbox):
    """Load CHIRPS rainfall for a specific date and bounding box"""
    base_url = "https://data.chc.ucsb.edu/products/CHIRPS-2.0/global_daily/tifs/p05"
    url = f"{base_url}/{date.strftime('%Y')}/chirps-v2.0.{date.strftime('%Y.%m.%d')}.tif"
    
    ds = xr.open_dataset(url, engine="rasterio")
    clipped = ds.sel(x=slice(bbox[0], bbox[2]), y=slice(bbox[3], bbox[1]))
    return clipped["band_data"]
```

---

## Municipal & Administrative Sources

### DLA (Department of Local Administration)

Oversees all 7,852 local administrative organizations in Thailand. Provides municipal profiles, budget data, and performance assessments.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.dla.go.th |
| **e-LAAS** | https://elaas.dla.go.th (Local Admin Assessment) |
| **Authentication** | Government account for detailed data |
| **Format** | PDF, Excel, HTML |
| **Update Frequency** | Annual |

**Key Datasets**:
- **Municipal Profile**: Population, area, revenue, expenditure by municipality
- **LQM (Local Quality Management)**: Performance scores across 7 dimensions
- **ITA (Integrity and Transparency Assessment)**: Anti-corruption indicators

```python
def scrape_municipal_profile(muni_code):
    """Fetch municipal profile from DLA website"""
    import requests
    from bs4 import BeautifulSoup
    
    url = f"https://www.dla.go.th/servlet/ProfServlet?muni_code={muni_code}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Extract profile table
    tables = soup.find_all("table")
    profile = {}
    for row in tables[0].find_all("tr"):
        cells = row.find_all("td")
        if len(cells) == 2:
            profile[cells[0].text.strip()] = cells[1].text.strip()
    
    return profile
```

---

### ITA (Integrity and Transparency Assessment)

DLA's annual assessment of transparency and anti-corruption practices in local administration.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.ita.dla.go.th |
| **Format** | HTML tables, downloadable Excel |
| **Update Frequency** | Annual |
| **Score Range** | 0–100 across 6 categories |

```python
def get_ita_scores(year=2567):
    """Scrape ITA scores for all municipalities in a given year"""
    url = f"https://www.ita.dla.go.th/ita_report.php?year={year}"
    response = requests.get(url)
    
    # Parse HTML table into DataFrame
    dfs = pd.read_html(response.text)
    df = dfs[0]
    df.columns = ["rank", "municipality", "province", "category_a", 
                  "category_b", "category_c", "category_d", "category_e", 
                  "category_f", "total_score"]
    return df
```

---

### e-LAAS (Local Administration Assessment System)

Comprehensive assessment system covering service quality, financial management, and citizen satisfaction.

| Attribute | Value |
|-----------|-------|
| **URL** | https://elaas.dla.go.th |
| **Authentication** | DLA account |
| **Format** | Web interface, PDF reports |

---

### LQM (Local Quality Management)

DLA's quality management assessment based on the Malcolm Baldrige framework adapted for Thai local government.

| Attribute | Value |
|-----------|-------|
| **Dimensions** | Leadership, Strategic Planning, Citizen Focus, Measurement, Workforce, Operations, Results |
| **Score Range** | 0–1000 |
| **Update Frequency** | Annual |

---

## International Open Data

### World Bank Open Data

Global development indicators with extensive Thailand coverage.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.worldbank.org |
| **API Base** | https://api.worldbank.org/v2 |
| **Authentication** | None required |
| **Format** | JSON, XML |
| **Indicators** | 17,000+ |

```python
def get_worldbank_indicator(indicator_code, country="THA", date_range="2010:2024"):
    """Fetch World Bank indicator data"""
    response = requests.get(
        f"https://api.worldbank.org/v2/country/{country}/indicator/{indicator_code}",
        params={"date": date_range, "format": "json", "per_page": 500}
    )
    data = response.json()[1]  # [0] is metadata
    return [
        {"year": d["date"], "value": d["value"]}
        for d in data if d["value"] is not None
    ]

# Example: GDP per capita (current US$)
gdp = get_worldbank_indicator("NY.GDP.PCAP.CD")
```

**Useful indicators for Thailand dashboards**:
- `SP.URB.TOTL.IN.ZS` - Urban population (%)
- `EN.ATM.PM25.MC.M3` - PM2.5 exposure (µg/m³)
- `IS.ROD.DNST.K2` - Road density
- `EG.ELC.ACCS.ZS` - Electricity access (%)

---

### UNDP Human Development Data

Human Development Index and component indicators at national and subnational levels.

| Attribute | Value |
|-----------|-------|
| **URL** | https://hdr.undp.org/data-center |
| **API** | Direct download (CSV) |
| **Authentication** | None |
| **Thailand HDI (2022)** | 0.803 (Very High) |

---

### HDX (Humanitarian Data Exchange)

Humanitarian and crisis-related data, useful for disaster response dashboards.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.humdata.org |
| **API** | CKAN API |
| **Authentication** | API Key (optional) |
| **Format** | CSV, GeoJSON, SHP |

---

### WorldPop

High-resolution population distribution data derived from census projections and satellite imagery.

| Attribute | Value |
|-----------|-------|
| **URL** | https://www.worldpop.org |
| **API** | Direct download or Google Earth Engine |
| **Authentication** | None |
| **Format** | GeoTIFF |
| **Resolution** | 100m, 1km |
| **Update Frequency** | Annual projections |

```python
def download_worldpop_thailand(year=2020):
    """Download Thailand population raster from WorldPop"""
    url = f"https://data.worldpop.org/GIS/Population/Global_2000_2020_Constrained/2020/maxar_v1/THA/{year}_THA_population.tif"
    response = requests.get(url)
    
    with open(f"/data/worldpop_tha_{year}.tif", "wb") as f:
        f.write(response.content)
    return f"/data/worldpop_tha_{year}.tif"
```

---

### Meta HRSL (High Resolution Settlement Layer)

Building footprint-derived population estimates from Meta (Facebook) and CIESIN.

| Attribute | Value |
|-----------|-------|
| **URL** | https://data.humdata.org/dataset/highresolutionpopulationdensitymaps |
| **Format** | CSV (tile-level), GeoTIFF |
| **Resolution** | 30m |
| **Update Frequency** | 2020 (static) |

---

## Quick Reference: All APIs at a Glance

| Source | Category | Auth | Format | Frequency | Cost |
|--------|----------|------|--------|-----------|------|
| data.go.th | National | API Key | JSON/CSV | Varies | Free |
| GISTDA | Geospatial | OAuth | GeoJSON | Real-time | Free |
| NSO | Statistical | None | Excel/CSV | Annual | Free |
| BMA Open Data | Bangkok | API Key | JSON/GeoJSON | Daily | Free |
| BMATraffic | Transit | API Key | GTFS-RT/JSON | Real-time | Free |
| Traffy Fondue | Incidents | API Key | GeoJSON | Real-time | Free |
| Air4Thai | Environmental | None | JSON | Hourly | Free |
| WAQI | Environmental | Token | JSON | Hourly | Free tier |
| World Bank | International | None | JSON | Annual | Free |
| WorldPop | Population | None | GeoTIFF | Annual | Free |
| CHIRPS | Climate | None | GeoTIFF | Daily | Free |

---

*For deployment instructions using these data sources, see [DEPLOYMENT.md](DEPLOYMENT.md). For municipality-specific integration patterns, see [THAILAND_MUNICIPALITIES.md](THAILAND_MUNICIPALITIES.md).*
