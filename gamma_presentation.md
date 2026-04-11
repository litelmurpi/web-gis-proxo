# UrbanInsight AI 
## From Seeing the Problem to Recommending the Solution

**Team Jamsuy**  
M. Gassa Sandy Revaldy Aji | Bintang A'araf Stevan Putra | Yudistira Azfa Dani Wibowo  
*Web Development Track*

---

# 01 / The Crisis: 3 Interconnected Urban Crises
Growing every year in Indonesian cities — and no tool addresses all three together.

- **🔥 Urban Heat Islands:** Cities are 1–7°C hotter than surrounding areas — raising health risks and energy consumption.
- **🌊 Recurring Floods:** Low drainage + high imperviousness = devastating periodic floods affecting millions.
- **🌳 Green Inequality:** Dense, lower-income neighborhoods have the least green space but the greatest need.

**The Gap:**  
Existing tools are *descriptive* (they show what's happening), but never answer: *"Where should we act, and which actions deliver the greatest impact?"*

---

# 02 / The Platform: Prescriptive Analytics
We don't just visualize problems — we recommend optimal solutions.

- **🌡️ Heat Prediction:** Computes Land Surface Temp per 100m grid cell via real-time weather & building density.
- **💧 Flood Scoring:** Composite flood probability (0–100) based on precipitation, soil moisture & water proximity.
- **✨ Green Equity Index:** Quantifies access inequality per cell — identifies 'Green Deserts' at the ward level.
- **🧠 RL Tree Placement (Flagship):** A Greedy RL Agent places trees optimally under budget, balancing 3 objectives simultaneously.

---

# 03 / System Design: Technical Architecture
Modern, real-time web + data pipeline at 100m geospatial resolution.

- **Frontend:** React 19 + MapLibre GL JS, TailwindCSS 4, Framer Motion, Recharts.
- **Backend (FastAPI + Python 3.10):**
   - **Grid Ops:** GeoPandas Generator
   - **Microclimate:** NumPy Engine
   - **RL Agent:** Greedy Optimizer
   - **API & Cache:** FastAPI + In-memory TTL
- **External Data Sources:** Open-Meteo, OSM/Nominatim, WorldPop TIF, GHSL Building TIF, ESA WorldCover TIF.

---

# 04 / The AI Engine: Multi-Objective RL Optimization
Balancing Heat, Flood, and Equity under realistic budget constraints.

**The Reward Function Evaluates Simultaneously:**  
`reward = (0.35 × Heat Δ) + (0.30 × Flood Δ) + (0.25 × Equity Δ) − (0.10 × Cost)`

**Per-Tree Expected Impact:**  
- **Heat Effect:** −0.5 to −1.5°C (with localized cooling on neighbors)
- **Flood Effect:** −3% to −11% risk reduction
- **Equity Effect:** +2 to +8 pts improvement

*The AI agent finds a Pareto-optimal placement — generating the highest collective ecological impact per budget unit.*

---

# 05 / Demo Highlights: Platform Features
A WebGIS that feels alive — from city search to live RL animation.

- **Interactive Map Explorer:** Toggle Heat, Flood, Equity, and Population layers in real-time.
- **Dynamic City Search:** Geocode any Indonesian city via Nominatim with auto boundary clipping.
- **RL Simulation:** Set a budget and watch the AI Agent place trees cell-by-cell with live animation.
- **Compare Baseline:** Instantly view Pre- and Post-simulation grids using GeoJSON diffing.
- **Analytics Dashboard:** City-level KPIs, radar charts, and distribution histograms.

---

# 06 / Value Proposition: A Genuine Leap Forward
From descriptive to prescriptive — no other platform in Indonesia combines this.

- **Core Proposition:** Prescriptive (Recommends) vs. Traditional Descriptive (Visualizes)
- **AI Engine:** Uses Reinforcement Learning to compute optimal placement.
- **Ecological Scope:** Combines Heat + Flood + Equity in one single engine.
- **Data Pipeline:** Pulls Real-Time API Data instead of using static historical sets.
- **Resolution:** Pinpoint accuracy at 100x100m grid cells.

---

# 07 / Impact: Who Benefits
Every tree planted is scientifically optimized for maximum ecological impact.

- **🏢 Urban Planners (BAPPEDA):** Data-driven spatial planning; allocate greening budgets where they matter most.
- **🌿 Environmental Agencies (DLH):** Identify Green Deserts and prioritize rapid interventions.
- **📋 Policy Makers:** Real-time condition dashboards for evidence-based decisions.
- **🎓 Academia & Researchers:** Access to reproducible 100m geospatial datasets and climate models.
- **👥 Communities:** Reduced UHI and flood impacts in the most vulnerable neighborhoods.

---

# 08 / Future Roadmap
From a working prototype to a comprehensive national urban climate platform.

- **v1 — Current (Live Now):** Interactive Map Explorer, Greedy RL Simulation, Analytics Dashboard.
- **v2 — Near Term (Q3 2026):** PostgreSQL + PostGIS spatial DB, GeoJSON export, IoT Sensor integration.
- **v3 — Mid Term (Q4 2026):** Full PPO Deep RL Agent, Multi-city Comparison, Public APIs.
- **v4 — Long Term (2027):** National Equity Index, Native Mobile App, Global Area Support.

---

# From Seeing to Solving.
"Which actions deliver the greatest impact?"  
**UrbanInsight AI answers this.**

---
**Team Jamsuy**  
GitHub: `/litelmurpi/web-gis-proxo`  
April 08, 2026
