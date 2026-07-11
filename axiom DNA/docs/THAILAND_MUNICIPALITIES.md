# Thailand Municipalities Reference

> Quick deployment reference for municipalities covered in the Axiom deployment series. Each profile includes key data sources, recommended sensors, estimated costs, and deployment timelines.

---

## Table of Contents

- [Yala City Municipality](#yala-city-municipality-thesaban-nakhon)
- [KMITL (King Mongkut's Institute of Technology Ladkrabang)](#kmitl-university-campus)
- [Muang Thong Thani](#muang-thong-thani-private-city)
- [Chulalongkorn University](#chulalongkorn-university)
- [Nakhon Si Thammarat City Municipality](#nakhon-si-thammarat-city-municipality)
- [Sikhio Town Municipality](#sikhio-town-municipality)

---

## Yala City Municipality (เทศบาลนครยะลา)

| Attribute | Value |
|-----------|-------|
| **Type** | Thesaban Nakhon (City Municipality) |
| **Province** | Yala |
| **Population** | ~62,000 |
| **Area** | 19.4 km² |
| **Region** | Southern Border Provinces |
| **Recommended Tier** | Medium |

### Context

Yala City operates in a unique operational environment. As the primary urban center in the southern border provinces, the municipality manages complex security-conscious urban operations while delivering standard municipal services. The terrain is relatively flat with a history of flash flooding during the northeast monsoon (November–January).

### Key Data Sources

| Priority | Source | Purpose | Integration |
|----------|--------|---------|-------------|
| Critical | GISTDA Flood Radar | Real-time flood monitoring | REST API polling every 15 min |
| Critical | Air4Thai | Air quality (nearest station: Yala) | REST API hourly |
| High | DLA Municipal Profile | Revenue, expenditure, personnel | Annual manual import |
| High | TPMAP | Poverty estimates by sub-district | Annual API fetch |
| Medium | CHIRPS Rainfall | Historical rainfall for flood modeling | Daily NetCDF ingest |
| Medium | NSO Population | Demographics and household data | Annual CSV import |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| City center (clock tower) | PM2.5 + meteorological | Baseline air quality | 1 |
| Sateng canal | Water level (ultrasonic) | Flood early warning | 3 |
| Major intersections | Traffic counter (camera-based) | Congestion monitoring | 4 |
| Municipal market | Noise level meter | Public health monitoring | 1 |
| City hall rooftop | Weather station (temp, humidity, rain, wind) | Climate baseline | 1 |

### Deployment Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Server provisioning, base stack deployment | PostgreSQL + Grafana operational |
| 2 | Boundary upload, GISTDA flood integration | Interactive flood map |
| 3 | Air quality dashboard, sensor installation (batch 1) | Live PM2.5 + weather display |
| 4 | Traffic counter integration, operator training | Operations room go-live |
| 6 | Full sensor deployment, Metabase launch | Self-service analytics for staff |
| 8 | Multi-language (TH/MS/ZH), public portal | Public-facing dashboard |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (Medium tier, 12 months) | 132,000 |
| Sensors + installation (11 nodes) | 55,000 |
| Custom development (security integrations) | 80,000 |
| Training + documentation | 20,000 |
| **Total Year 1** | **287,000** |

### Special Considerations

- **Multi-language requirement**: Malay (Jawi script) support strongly recommended for public-facing components in addition to Thai
- **Connectivity**: Ensure redundant internet (fiber + 4G backup) given geographic isolation
- **Security**: Coordinate with Internal Security Operations Command (ISOC) for any camera placement in sensitive zones

---

## KMITL (King Mongkut's Institute of Technology Ladkrabang)

| Attribute | Value |
|-----------|-------|
| **Type** | University Campus |
| **Location** | Lat Krabang, Bangkok |
| **Population** | ~25,000 (students + staff) |
| **Area** | 2,370 rais (~3.8 km²) |
| **Recommended Tier** | Small (expanded) |

### Context

A university campus functions as a micro-city with distinct operational patterns: dormitory energy peaks at night, class change creates 15-minute pedestrian surges, and parking is a perpetual source of complaints. The campus has existing IT infrastructure and fiber backbone that can be leveraged.

### Key Data Sources

| Priority | Source | Purpose |
|----------|--------|---------|
| Critical | Campus energy meters (IoT) | Building-level electricity monitoring |
| Critical | Existing CCTV network | Pedestrian flow + parking occupancy |
| High | Air4Thai (Lat Krabang station) | Campus air quality context |
| High | BMATraffic (nearby roads) | Adjacent road congestion |
| Medium | Academic calendar | Predictive load modeling |
| Medium | University shuttle GPS | Internal transit tracking |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| Library + 5 faculties | Energy meter (Modbus to MQTT) | Building energy monitoring | 6 |
| 4 parking lots | Ultrasonic occupancy | Real-time parking availability | 4 |
| Main pedestrian spine | People counter (thermal) | Class change flow analysis | 3 |
| Central lawn | PM2.5 + weather station | Campus microclimate | 1 |
| Cafeteria | CO2 + noise | Indoor air quality + occupancy | 2 |
| Shuttle stops | BLE beacon + gateway | Shuttle arrival predictions | 8 |

### Deployment Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Deploy on existing VM infrastructure | Core stack live |
| 2 | Modbus gateway integration for energy meters | Energy dashboard |
| 3 | Parking sensor deployment | Parking availability app |
| 4 | People counter calibration + pedestrian heatmap | Facilities management view |
| 5 | Shuttle tracking integration | Student mobile-friendly transit view |
| 6 | Public portal (student-facing) | Open campus dashboard |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (on-premise VM, minimal) | 15,000 |
| Sensors + hardware (24 nodes + gateways) | 85,000 |
| Modbus/SCADA integration | 40,000 |
| **Total Year 1** | **140,000** |

### Special Considerations

- **WiFi infrastructure**: Campus WiFi can backhaul ESP32 sensors—no additional LoRaWAN needed
- **Student developers**: Engage computer engineering students for ongoing maintenance
- **Energy savings ROI**: Target 10% reduction in HVAC costs through occupancy-based controls to justify the project financially

---

## Muang Thong Thani (เมืองทองธานี)

| Attribute | Value |
|-----------|-------|
| **Type** | Private City / Mixed-Use Development |
| **Location** | Pak Kret, Nonthaburi |
| **Population** | ~150,000 (residents + daytime workers) |
| **Area** | ~8 km² |
| **Recommended Tier** | Medium |

### Context

Muang Thong Thani is one of Thailand's largest private mixed-use developments—a self-contained city with residential towers, the Impact exhibition center, corporate offices, schools, hospitals, and retail. Unlike a municipality, governance is private, enabling faster decision-making but requiring all infrastructure to be privately funded and maintained.

### Key Data Sources

| Priority | Source | Purpose |
|----------|--------|---------|
| Critical | Private SCADA (existing) | Building management systems |
| Critical | Impact Exhibition visitor data | Event-driven traffic prediction |
| High | Traffy Fondue (area reports) | Public road incident awareness |
| High | Air4Thai (Pak Kret station) | Regional air quality |
| Medium | BMATraffic | Adjacent highway congestion |
| Medium | CHIRPS + GISTDA | Flood risk (area is low-lying) |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| Impact Arena perimeter | People counter + parking | Event crowd management | 6 |
| Main arterial roads | Traffic speed radar | Real-time congestion | 4 |
| Residential towers (rooftop) | PM2.5 + weather | Resident-facing air quality | 3 |
| Canal system | Water level + quality | Flood + environmental monitoring | 4 |
| Retail areas | Noise + footfall | Tenant analytics | 4 |
| EV charging stations | Power draw + occupancy | Charging infrastructure management | 2 |

### Deployment Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Infrastructure deployment + BMS integration | SCADA data flowing |
| 2 | Event management dashboard | Impact operations view |
| 3 | Residential air quality + public app | Resident-facing portal |
| 4 | Full traffic sensor deployment | Navigation-integrated routing |
| 6 | Predictive analytics (event impact model) | Pre-event capacity planning |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (Medium tier, 12 months) | 132,000 |
| Sensors + installation (23 nodes) | 115,000 |
| BMS/SCADA integration | 120,000 |
| Mobile app development (resident) | 150,000 |
| **Total Year 1** | **517,000** |

### Special Considerations

- **Revenue model**: Sensor data can be monetized as footfall analytics for retail tenants
- **Event integration**: Coordinate with Impact scheduling API for predictive traffic management
- **Resident app**: White-label the public portal as a branded Muang Thong Thani resident app

---

## Chulalongkorn University

| Attribute | Value |
|-----------|-------|
| **Type** | University (Flagship National Institution) |
| **Location** | Pathum Wan, Bangkok |
| **Population** | ~40,000 (students + staff) |
| **Area** | ~1.6 km² (central campus) |
| **Recommended Tier** | Small (high-density) |

### Context

Located in the heart of Bangkok's CBD adjacent to Siam Square, Chulalongkorn's central campus operates as a high-density urban microcosm. The university has existing smart campus initiatives and strong research partnerships that can accelerate deployment.

### Key Data Sources

| Priority | Source | Purpose |
|----------|--------|---------|
| Critical | BTS Siam/National Stadium feeds | Transit integration |
| Critical | Air4Thai (Bangkok center) | Urban air quality |
| High | BMATraffic (Rama I, Phaya Thai) | Adjacent road congestion |
| High | BMA pedestrian counts (if available) | Walking route analytics |
| Medium | University shuttle GPS | Internal mobility |
| Medium | Electricity Authority (MEA) data | Campus energy benchmarking |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| 8 faculty buildings | Energy sub-meters | Granular energy tracking | 8 |
| Campus perimeter gates | People counter | Real-time campus population | 4 |
| Green spaces (3 parks) | PM2.5 + microclimate | Research + wellness data | 3 |
| Parking structures | Vehicle count | Parking availability | 3 |
| Library + student center | CO2 + occupancy | Indoor environment quality | 4 |
| Street lamps | Smart lighting controller | Energy-efficient campus lighting | 20 |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (Small tier, 12 months) | 22,200 |
| Sensors + hardware (42 nodes) | 140,000 |
| Research collaboration (student labor) | (absorbed) |
| **Total Year 1** | **162,200** |

### Special Considerations

- **Research partnership**: Frame as a living lab—publish papers on the deployment experience
- **BTS integration**: Campus population correlates strongly with BTS frequency; display combined wait times
- **Heritage buildings**: Some sensors require aesthetic concealment on historic structures

---

## Nakhon Si Thammarat City Municipality (เทศบาลนครนครศรีธรรมราช)

| Attribute | Value |
|-----------|-------|
| **Type** | Thesaban Nakhon (City Municipality) |
| **Province** | Nakhon Si Thammarat |
| **Population** | ~105,000 |
| **Area** | 22.6 km² |
| **Recommended Tier** | Medium |

### Context

The largest city in southern Thailand outside of Hat Yai, Nakhon Si Thammarat has a historic core (the old city walls) surrounded by modern commercial and residential development. The municipality faces coastal flooding risk, traffic congestion around the iconic Wat Phra Mahathat, and waste management challenges from tourism peaks during religious festivals.

### Key Data Sources

| Priority | Source | Purpose |
|----------|--------|---------|
| Critical | GISTDA Flood Radar | Coastal + riverine flood monitoring |
| Critical | Air4Thai (Nakhon Si Thammarat station) | Air quality |
| High | Traffy Fondue | Municipal incident reporting |
| High | DLA ITA scores | Transparency benchmarking |
| Medium | CHIRPS rainfall | Flood prediction model input |
| Medium | NSO provincial data | Socio-economic context |
| Medium | Tourism Authority data | Festival crowd prediction |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| Pak Nakhon river | Water level + flow rate | Flood early warning | 3 |
| Historic core | Pedestrian counter | Tourism management | 2 |
| 4 major intersections | Traffic counter | Congestion monitoring | 4 |
| Municipal offices rooftop | PM2.5 + weather | Baseline environmental | 1 |
| Waste collection depots | Fill-level sensors | Route optimization | 3 |
| City center | Noise meter | Public health | 2 |

### Deployment Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1–2 | Infrastructure, base stack | Core platform live |
| 3 | GISTDA flood integration, river sensors | Flood dashboard |
| 4 | Air quality + weather | Environmental baseline |
| 5 | Traffic sensors + historic core analytics | Tourism management view |
| 6 | Waste optimization + route planning | Operational efficiency gains |
| 8 | Full public portal + festival mode | Public engagement |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (Medium tier, 12 months) | 132,000 |
| Sensors + installation (16 nodes) | 80,000 |
| Custom flood model integration | 60,000 |
| Training + change management | 25,000 |
| **Total Year 1** | **297,000** |

### Special Considerations

- **Festival mode**: Hae Pha Khuen That festival draws 100,000+ visitors; dashboard needs a special festival view
- **Heritage zone**: Sensor placement in the old city requires Fine Arts Department coordination
- **Provincial coordination**: Share flood data with provincial disaster prevention office

---

## Sikhio Town Municipality (เทศบาลเมืองสีคิ้ว)

| Attribute | Value |
|-----------|-------|
| **Type** | Thesaban Mueang (Town Municipality) |
| **Province** | Nakhon Ratchasima (Korat) |
| **Population** | ~22,000 |
| **Area** | 6.8 km² |
| **Recommended Tier** | Small |

### Context

Sikhio represents the typical Thai town municipality—a railway town on the northeastern line with a compact urban core surrounded by agricultural land. Limited IT staff (typically 1–2 people), constrained budget, and reliance on provincial coordination for major infrastructure decisions. This is the smallest viable deployment profile for the Axiom Framework.

### Key Data Sources

| Priority | Source | Purpose | Access |
|----------|--------|---------|--------|
| Critical | Air4Thai (Nakhon Ratchasima station) | Regional air quality | Public API |
| High | DLA municipal profile | Administrative baseline | Web scrape |
| High | NSO provincial data | Demographics | CSV download |
| Medium | CHIRPS rainfall | Flood context | Direct download |
| Medium | GISTDA (flood as needed) | Event-based monitoring | API |
| Low | TPMAP | Poverty context | API |

### Recommended Sensors

| Location | Sensor Type | Purpose | Quantity |
|----------|-------------|---------|----------|
| Municipality office | PM2.5 + weather | Baseline environmental | 1 |
| Railway crossing | Traffic counter | Train-delay impact on traffic | 1 |
| Market area | Noise level | Public health monitoring | 1 |
| Low-lying residential | Water level | Flood risk area | 1 |
| Highway 2 intersection | Vehicle counter | Through-traffic analysis | 1 |

### Deployment Timeline

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | VPS provisioning, single-server deployment | All services live |
| 2 | Air quality integration + Grafana dashboard | First operational view |
| 3 | Sensor installation (batch) | Live telemetry from 5 nodes |
| 4 | Operator training, documentation handover | Sustainable operations |

### Estimated Cost

| Category | Amount (THB) |
|----------|-------------|
| Infrastructure (Small tier, 12 months) | 22,200 |
| Sensors + installation (5 nodes) | 25,000 |
| Setup assistance (contractor, 2 weeks) | 30,000 |
| **Total Year 1** | **77,200** |

### Special Considerations

- **Staff capacity**: Assume 1 IT staff member with limited Docker/Linux experience; provide comprehensive runbook
- **Internet reliability**: Small-town internet can be intermittent; design for offline resilience with local caching
- **Provincial coordination**: Route major data requests through Nakhon Ratchasima provincial hall for faster government response
- **Sustainability**: At this budget level, project must demonstrate clear ROI within 6 months to secure ongoing funding

---

## Comparative Summary

| Municipality | Tier | Population | Sensors | Year 1 Cost (THB) | Go-Live |
|--------------|------|-----------|---------|-------------------|---------|
| Sikhio | Small | 22,000 | 5 | 77,200 | 4 weeks |
| KMITL | Small+ | 25,000 | 24 | 140,000 | 6 weeks |
| Chulalongkorn | Small+ | 40,000 | 42 | 162,200 | 6 weeks |
| Yala City | Medium | 62,000 | 11 | 287,000 | 8 weeks |
| Nakhon Si Thammarat | Medium | 105,000 | 16 | 297,000 | 8 weeks |
| Muang Thong Thani | Medium | 150,000 | 23 | 517,000 | 6 weeks |

---

*For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md). For data source integration code, see [DATA_SOURCES.md](DATA_SOURCES.md).*
