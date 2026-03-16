# UrbanInsight AI

> **A prescriptive WebGIS platform for sustainable urban planning.**
> We don't just visualize urban problems — we recommend where and how to act.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)

---

## Overview

UrbanInsight AI combines geospatial data, physics-based microclimate modeling, and a Reinforcement Learning agent to help urban planners make data-driven decisions about:

- **Urban Heat** — where the city is hottest and why
- **Flood Risk** — which neighborhoods are most vulnerable
- **Green Equity** — where access to green space is most unequal
- **Tree Placement** — the optimal locations to plant trees for maximum multi-objective impact

---

## Features

| Feature | Description |
|---|---|
| 🗺️ **Map Explorer** | Interactive grid-based city map with 4 data layers (Heat, Flood, Equity, Population) |
| 🤖 **RL Simulation** | Greedy RL Agent plants trees optimally under a budget constraint |
| 📊 **Analytics** | City-level statistical breakdown per data dimension |
| 🔄 **Compare Baseline** | Toggle between pre- and post-simulation grid to see projected impact |
| 🔍 **Dynamic City Search** | Search any city via Nominatim geocoder — not limited to a single pilot city |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        FRONTEND                         │
│   React 19 + Vite  ·  MapLibre GL JS  ·  Framer Motion │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP (Axios)
┌─────────────────────────▼───────────────────────────────┐
│                        BACKEND                          │
│              FastAPI (Python 3.10) + Uvicorn            │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ grid.py     │  │ rl_engine.py │  │  endpoints.py │  │
│  │ (microclimate│  │ (Greedy RL   │  │  simulation.py│  │
│  │  synthesis) │  │  Agent)      │  │               │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────────┘  │
│         │                │                              │
│  ┌──────▼────────────────▼──────────────────────────┐  │
│  │              External Data Sources                 │  │
│  │  Open-Meteo · OSM/Nominatim · WorldPop TIF        │  │
│  │  GHSL Building TIF · ESA WorldCover TIF           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## AI Modules

### 1. Urban Heat Prediction
Computes Land Surface Temperature (LST) per grid cell:
```
LST = base_temp (Open-Meteo) + building_density (GHSL) × 6°C − green_density (ESA WorldCover) × 4°C
```

### 2. Flood Risk Scoring
Composite score (10–95) per grid cell:
```
FloodScore = 20 + building_density × 30 + water_proximity × 40 + precip_factor × 20 + soil_factor × 10
```
Weather inputs (precipitation, soil moisture) come from Open-Meteo daily/current API.

### 3. Green Equity Index
Equity score (5–95) measuring green space access:
```
EquityScore = green_density × 100 + (1 - building_density) × 20
```

### 4. RL Tree Placement (Greedy Agent)
At each step, the agent selects the cell with the highest expected multi-objective reward:
```
reward = w_heat × |ΔT|/1.5 + w_flood × |ΔFlood|/11 + w_equity × ΔEquity/8 − w_cost × green_density
```
Per tree effect:
- **Heat**: −0.5 to −1.5°C on planted cell + −0.05°C on neighbors
- **Flood**: −3 to −11% on planted cell
- **Equity**: +2 to +8 pts on planted cell + +0.5 pts on neighbors

---

## Tech Stack

### Frontend
- **React 19** + **Vite**
- **MapLibre GL JS** — data-driven grid map with hover tooltips
- **Vanilla CSS** — custom design system (dark theme, glassmorphism)
- **Framer Motion** — scroll & entrance animations
- **Lucide React** — icons

### Backend
- **FastAPI** (Python 3.10) + **Uvicorn**
- **GeoPandas** + **Shapely** — geospatial grid creation & clipping
- **NumPy** — vectorized microclimate formulas
- **Rasterio** — sampling WorldPop, GHSL, ESA WorldCover TIF files
- **HTTPX** — async HTTP calls to Open-Meteo & Nominatim

### Data Sources
| Source | Used For |
|---|---|
| [Open-Meteo](https://open-meteo.com) | Current temperature, precipitation, soil moisture |
| [WorldPop](https://www.worldpop.org) | Population count per grid cell (`idn_ppp_2020_compressed.tif`) |
| [GHSL](https://ghsl.jrc.ec.europa.eu) | Building density per grid cell |
| [ESA WorldCover](https://esa-worldcover.org) | Land cover / green density classification |
| [OpenStreetMap / Nominatim](https://nominatim.org) | City geocoding & boundary polygon |
| [Overpass API](https://overpass-api.de) | Buildings, waterways, greenspace polygons (simulation) |

---

## Project Structure

```
16-gis/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints.py       # GET /analysis/search, /health
│   │   │   └── simulation.py      # POST /simulate, /simulate/quick
│   │   ├── services/
│   │   │   ├── grid.py            # Grid creation + microclimate synthesis
│   │   │   ├── rl_engine.py       # RLEnvironment + GreedyRLAgent
│   │   │   ├── geocoder.py        # Nominatim city boundary lookup
│   │   │   ├── open_meteo.py      # Weather API client
│   │   │   ├── osm.py             # OSM Overpass data fetcher
│   │   │   └── cache.py           # In-memory simulation grid cache
│   │   └── main.py
│   ├── data/
│   │   ├── idn_ppp_2020_compressed.tif   # WorldPop Indonesia
│   │   ├── Building/                     # GHSL building density TIFs
│   │   └── terrascope_download_*/        # ESA WorldCover TIFs
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── MapExplorer.jsx
│   │   │   ├── Simulation.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── About.jsx
│   │   ├── components/
│   │   │   ├── map/MapContainer.jsx      # MapLibre GL map
│   │   │   ├── simulation/
│   │   │   │   ├── SimulationControls.jsx
│   │   │   │   └── SimulationStats.jsx   # Compare Baseline toggle
│   │   │   └── common/                  # Button, Card, Threads, etc.
│   │   ├── hooks/
│   │   │   └── useSimulation.js          # Simulation state & animation
│   │   ├── services/
│   │   │   └── api.js                    # Axios API client
│   │   └── context/
│   │       └── LayerContext.jsx
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- TIF data files in `backend/data/` (WorldPop, GHSL, ESA WorldCover)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000/api`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

App will be available at `http://localhost:5173`

### Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## API Reference

### `GET /api/analysis/search?city={name}`
Geocodes a city and generates the grid with microclimate data.

**Response:**
```json
{
  "center": [lng, lat],
  "bbox": [min_lon, min_lat, max_lon, max_lat],
  "geojson": { "type": "FeatureCollection", "features": [...] }
}
```

Each GeoJSON feature has properties: `lst`, `floodScore`, `equityScore`, `population`, `building_density`, `green_density`.

---

### `POST /api/simulate`
Runs the full RL tree placement simulation.

**Request body:**
```json
{
  "city": "Surabaya",
  "budget": 50,
  "weights": { "heat": 0.35, "flood": 0.30, "equity": 0.25, "cost": 0.10 }
}
```

**Response:**
```json
{
  "before": { "avg_lst": 32.1, "avg_flood": 45.2, "avg_equity": 38.7 },
  "after":  { "avg_lst": 31.8, "avg_flood": 44.1, "avg_equity": 41.3 },
  "steps":  [{ "step": 1, "lng": 112.72, "lat": -7.28, "reward": 0.74, ... }],
  "grid_after": { "type": "FeatureCollection", ... },
  "summary": {
    "trees_planted": 50,
    "delta_avg_lst": 0.08,
    "delta_avg_flood": 0.17,
    "delta_avg_equity": 0.59,
    "total_reward": 34.2
  }
}
```

### `POST /api/simulate/quick`
Re-runs RL simulation using cached grid (skips geocoding + data fetch).

---

## How Compare Baseline Works

When simulation completes, `grid_after` is a full GeoJSON with modified `lst`, `floodScore`, and `equityScore` values reflecting the impact of all planted trees.

The **Compare Baseline** toggle in `SimulationStats` switches the MapLibre source between:
- **OFF** → `cityGeoJSON` (original, before simulation)
- **ON** → `gridAfter` (post-simulation, projected impact)

MapLibre's data-driven color rules automatically re-render the grid colors based on the new property values.

---

## License

MIT © 2025 UrbanInsight AI Team

---

## Repository

[github.com/litelmurpi/web-gis-proxo](https://github.com/litelmurpi/web-gis-proxo)
