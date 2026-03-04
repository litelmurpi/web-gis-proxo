# RENCANA PELAKSANAAN DAN DESAIN (RPD)

## UrbanInsight AI

## Platform WebGIS Berbasis AI untuk Perencanaan Kota Berkelanjutan

```
Tagline: "Don't just see the problem. Solve it."
```

## DAFTAR ISI

1. Informasi Proyek
2. Latar Belakang
3. Pernyataan Masalah
4. Tujuan Proyek
5. Ruang Lingkup
6. Solusi & Fitur Utama
7. Arsitektur Sistem
8. Model AI/ML & RL
9. Sumber Data
10. Roadmap Implementasi
11. Target Pengguna
12. Keunggulan Kompetitif
13. Risiko & Mitigasi
14. Rencana Masa Depan
15. Kesimpulan

## 1. INFORMASI PROYEK

```
Atribut Detail
Nama Proyek UrbanInsight AI
Kategori Platform WebGIS + AI untuk Smart City
```

```
Atribut Detail
Domain Urban Planning, Geospatial AI,
Environmental Tech
Tanggal Mulai 1 Maret 2026
Target Selesai 10 Maret 2026
Target Pitching 5 April 2026
Tipe Aplikasi Web Application (Full-Stack)
Status Aktif — Development Sprint
```

## 2. LATAR BELAKANG

Urbanisasi yang masif di kota-kota Indonesia menghadirkan tantangan baru yang kompleks dan
saling berkaitan. Kota-kota besar seperti Jakarta, Surabaya, Bandung, dan Medan mengalami
tekanan ekosistem yang serius akibat pertumbuhan populasi, alih fungsi lahan, dan minimnya
ruang terbuka hijau (RTH).
Permasalahan kunci yang dihadapi antara lain:

- **Urban Heat Island (UHI):** Suhu permukaan di kawasan urban dapat mencapai 1–7°C
  lebih tinggi dibandingkan area rural akibat dominasi beton, aspal, dan minimnya
  vegetasi.
- **Risiko Banjir:** Curah hujan ekstrem dikombinasikan dengan rendahnya kapasitas
  drainase dan tingginya imperviousness lahan menciptakan banjir periodik yang
  merendam kawasan padat penduduk.
- **Ketimpangan Ruang Terbuka Hijau:** Akses terhadap RTH tidak merata — kelurahan
  padat miskin sering kali menjadi "green desert" yang justru paling membutuhkan
  intervensi hijau.
- **Ketidaksiapan Tools Perencanaan:** Perencana kota dan pembuat kebijakan tidak
  memiliki platform berbasis data dan kecerdasan buatan yang dapat memberikan
  rekomendasi tindakan konkret.
  Saat ini, tools yang tersedia (seperti BNPB inaRISK, platform GIS konvensional, atau hasil riset
  akademik) hanya bersifat deskriptif atau prediktif — menampilkan kondisi yang ada, tetapi tidak
  memberikan jawaban atas pertanyaan yang paling kritis: **"Di mana harus bertindak, dan
  tindakan apa yang memberikan dampak paling besar?"**

**UrbanInsight AI hadir untuk menjawab celah tersebut.** Dengan menggabungkan machine
learning berbasis data satelit, analisis geospasial resolusi tinggi, dan reinforcement learning
(RL) untuk simulasi perencanaan, UrbanInsight AI tidak sekadar memvisualisasikan masalah —
tetapi secara aktif merekomendasikan solusi yang optimal.

## 3. PERNYATAAN MASALAH

### 3.1 Problem Statement Utama

```
Perencana kota tidak memiliki akses terhadap platform terintegrasi berbasis AI
yang mampu secara bersamaan menganalisis risiko iklim urban (panas, banjir,
ketimpangan hijau) dan merekomendasikan intervensi spasial yang optimal dengan
mempertimbangkan keterbatasan anggaran.
```

### 3.2 Gap yang Diidentifikasi

```
Dimensi Masalah Kondisi Saat Ini Gap
Urban Heat Island Tidak ada peta LST real-time
berbasis ML
Tidak ada baseline untuk
intervensi berbasis data
Risiko Banjir Peta banjir statis dan makro Tidak ada flood risk scoring
probabilistik per grid 100m
Ketimpangan RTH Tidak diukur secara spasial &
kuantitatif
Tidak diketahui kelurahan
mana yang paling
kekurangan RTH
Tools Proaktif Tools bersifat
deskriptif/prediktif saja
Tidak ada rekomendasi
spasial berbasis AI untuk
intervensi
```

### 3.3 Dampak dari Gap Tersebut

- Anggaran penghijauan kota tidak tepat sasaran
- Masyarakat miskin urban menanggung beban UHI dan banjir terbesar
- Perencana kota mengambil keputusan berdasarkan intuisi, bukan data
- Kerugian sosial-ekonomi akibat bencana urban yang seharusnya bisa dimitigasi

## 4. TUJUAN PROYEK

### 4.1 Tujuan Umum

Membangun platform WebGIS berbasis AI yang membantu perencana kota dan pembuat
kebijakan dalam menganalisis risiko iklim urban secara terpadu dan menerima rekomendasi
intervensi spasial yang optimal.

### 4.2 Tujuan Khusus

1. **Mengembangkan model ML** untuk memprediksi Land Surface Temperature (LST) per
   grid 100m dengan target akurasi MAE < 1.5°C dan R² > 0.85.
2. **Mengembangkan model ML** untuk menghitung probabilitas risiko banjir per grid
   dengan target AUC-ROC > 0.80.
3. **Mengembangkan Green Equity Index** berbasis Gini Coefficient yang mengukur
   ketimpangan akses RTH secara spasial dan kuantitatif.
4. **Mengembangkan RL agent** (PPO) yang mampu merekomendasikan penempatan
   pohon optimal dengan multi-objective optimization (suhu + banjir + green equity +
   budget).
5. **Membangun platform WebGIS** yang accessible, interaktif, dan real-time dengan fitur
   simulasi before/after.
6. **Mendeploy aplikasi** ke lingkungan produksi yang stabil dan siap dipresentasikan.

### 4.3 Kriteria Keberhasilan (Success Metrics)

```
Kriteria Target
Akurasi Heat Prediction MAE < 1.5°C, R² > 0.
Akurasi Flood Risk AUC-ROC > 0.
RL Convergence Reward meningkat konsisten dalam 300K
timesteps
Waktu Respons API < 2 detik untuk query grid
Simulasi Real-time WebSocket streaming berjalan tanpa lag
signifikan
Demo Stability Aplikasi berjalan stabil saat pitching
```

## 5. RUANG LINGKUP

### 5.1 Dalam Lingkup (In Scope)

- Platform WebGIS berbasis web (browser-based, no installation)
- 4 modul AI: Urban Heat Prediction, Flood Risk, Green Equity Index, RL Tree Placement
- Data geospasial resolusi 100m × 100m grid
- Visualisasi interaktif peta dan analitik dashboard
- Simulasi RL dengan animasi real-time dan statistik before/after
- Export hasil: GeoJSON, CSV, PDF Report
- Deployment ke cloud hosting (Railway/Render + Supabase + Vercel)
- Demo video dan dokumentasi GitHub

### 5.2 Di Luar Lingkup (Out of Scope)

- Integrasi sensor IoT fisik (masuk roadmap v2)
- Dukungan multi-kota secara bersamaan (terbatas 1 kota untuk demo)
- Aplikasi mobile native (iOS/Android)
- Open public API (masuk roadmap v2)
- Validasi lapangan / ground truth survey
- Integrasi pembayaran atau akun pengguna

### 5.3 Asumsi

- Data satelit dari Google Earth Engine tersedia dan dapat diunduh dalam timeline
- Model ML dapat dilatih dengan data historis yang memadai
- RL agent dapat didemonstrasikan dengan grid yang disimplifikasi (20×20 untuk demo)
- Satu developer utama mengerjakan seluruh stack dalam 10 hari kerja

## 6. SOLUSI & FITUR UTAMA

UrbanInsight AI dirancang sebagai platform **prescriptive analytics** — melampaui deskriptif dan
prediktif untuk memberikan rekomendasi tindakan konkret.

### 6.1 Modul 1 — Satellite-Based Urban Heat Prediction

**Deskripsi:** Peta suhu permukaan (LST) berbasis data satelit Landsat 8/9 per grid 100m,
diprediksi menggunakan XGBoost Regressor.
**Fitur Output WebGIS:**

- Heatmap choropleth (merah >38°C → biru <28°C)
- Hotspot detection otomatis
- Hover tooltip: LST aktual vs prediksi, NDVI, land cover
- Time slider perbandingan multi-temporal
  **Data Input:**
- Landsat 8/9 Band 10 → LST
- Sentinel-2 Band 4 & 8 → NDVI
- OpenStreetMap → Building footprint density
- BPS/WorldPop → Population density

### 6.2 Modul 2 — Flood Risk Prediction

**Deskripsi:** Scoring probabilitas risiko banjir per grid (0.0–1.0) menggunakan XGBoost Classifier
dengan 9 fitur geospasial.
**Kategori Risiko:**

- Rendah (0.0–0.3)
- Sedang (0.3–0.6)
- Tinggi (0.6–0.8)
- Sangat Tinggi (0.8–1.0)
  **Fitur Output WebGIS:**
- Risk zone map choropleth 4 kategori
- Radar chart faktor risiko per grid
- Scenario simulation: "Jika curah hujan +50mm, area berisiko tinggi bertambah X%"
- Overlay dengan data kepadatan populasi
  **Data Input:**
- SRTM/NASADEM → Digital Elevation Model
- CHIRPS/BMKG → Rainfall historis
- OpenStreetMap → Jarak ke sungai dan drainase
- Copernicus/ESA WorldCover → Land cover
- BNPB → Historical flood events (label training)

### 6.3 Modul 3 — Green Equity Index

**Deskripsi:** Pengukuran ketimpangan akses RTH secara spasial menggunakan modified Gini
Coefficient dan K-Means Clustering.

**Metodologi 3-Step:**

1. **Green Space Accessibility Score:** Jarak ke RTH (50%) + luas RTH dalam radius 500m
   (30%) + kualitas RTH (20%)
2. **Population-Weighted Equity Analysis:** Equity Index 0–100 (0 = tidak merata, 100 =
   merata sempurna)
3. **K-Means Clustering (4 klaster):** - Green Privilege — akses RTH tinggi, populasi rendah - Green Desert — akses RTH rendah, populasi tinggi (prioritas intervensi) - Balanced Access — distribusi seimbang - Low Density Rural — area pinggiran dengan kepadatan rendah
   **Fitur Output WebGIS:**

- Equity Cluster Map berdasarkan 4 klaster
- City Equity Score (0–100)
- Highlight "Green Desert" areas
- Perbandingan antar kelurahan/kecamatan
- Overlay dengan data pendapatan

### 6.4 Modul 4 — RL Optimal Tree Placement (Fitur Unggulan)

**Deskripsi:** Fitur paling inovatif dari UrbanInsight AI. RL agent berbasis PPO (Proximal Policy
Optimization) secara cerdas memilih lokasi penanaman pohon yang memaksimalkan dampak
bersamaan terhadap 3 tujuan: penurunan suhu, pengurangan risiko banjir, dan peningkatan
green equity — dengan constraint budget pohon.
**RL Environment Design:**

- Class: UrbanTreePlacementEnv(gym.Env)
- State Space: Grid N×N, per cell: [LST, flood_risk, green_score, population_density,
  tree_planted]
- Action Space: Discrete — pilih 1 grid cell untuk ditanami pohon (dengan masking)
- Episode: 1 siklus perencanaan, max steps = budget (misal 100 pohon)
  **Reward Function (Multi-Objective):**
  reward = (0.35 x delta_T_reduction) + (0.30 x delta_Flood_reduction) + (0.25 x
  delta_Equity_improvement) + (-0.10 x cost_penalty)
  **Fitur Output WebGIS — Simulation Mode:**
- User pilih kota + budget (10–500 pohon)

- Animasi real-time penempatan pohon via WebSocket
- Live stats bar: perubahan suhu, risiko banjir, equity score
- Before/After toggle slider untuk komparasi kondisi
- Export: GeoJSON, CSV, PDF Report

## 7. ARSITEKTUR SISTEM

### 7.1 Arsitektur 3-Tier

##### FRONTEND LAYER

- Next.js 14 + TailwindCSS
- MapLibre GL JS (WebGIS Engine)
- Recharts + D3.js (Analytics)
- HTML5 Canvas + WebSocket (Simulation Viewer)
  **BACKEND API LAYER (FastAPI Python)**
- /api/map | /api/grid | /api/analysis | /api/simulate
- /api/export | /ws/simulation (WebSocket)
  **AI / ML SERVICE LAYER**
- XGBoost (Heat Prediction, Flood Risk) + scikit-learn
- Gymnasium + Stable-Baselines3 PPO (RL Engine)
- Rasterio + GeoPandas + Shapely (Geospatial Processing)
  **DATABASE LAYER**
- PostgreSQL + PostGIS (grid_cells, predictions, rl_results, cities)
- Redis (Cache GeoJSON, RL results, ML scores)
  **EXTERNAL DATA SOURCES**
- Google Earth Engine API | BMKG API | OpenAQ API
- OSM Overpass | SRTM/NASADEM | WorldPop | BNPB | CHIRPS

### 7.2 Tech Stack Lengkap

```
Layer Teknologi
Frontend Next.js 14, TailwindCSS, MapLibre GL JS,
Recharts, D3.js, HTML5 Canvas, WebSocket
Backend FastAPI (Python)
ML Models XGBoost, scikit-learn
RL Framework Gymnasium, Stable-Baselines3 (PPO)
Geospatial Rasterio, GeoPandas, Shapely
Satellite Data Google Earth Engine Python API
Database PostgreSQL + PostGIS
Cache Redis
Export ReportLab (PDF), Pandas (CSV)
Containerization Docker + Docker Compose
Hosting Railway/Render (Backend), Supabase (DB),
Vercel (Frontend)
Version Control GitHub
```

### 7.3 Data Foundation — Grid Spasial 100m x 100m

Seluruh sistem dibangun di atas grid spasial resolusi 100m x 100m. Setiap grid cell menyimpan:
**Field Deskripsi**
grid_id Identifier unik grid cell
center_coord Koordinat pusat (lat, lon)
lst Land Surface Temperature (°C)
ndvi Normalized Difference Vegetation Index
land_cover_class Kelas tutupan lahan

```
Field Deskripsi
elevation Ketinggian (m dpl)
building_density Kepadatan bangunan (%)
population_density Kepadatan penduduk (jiwa/km²)
rainfall_accumulation Akumulasi curah hujan (mm)
distance_to_green_space Jarak ke RTH terdekat (m)
flood_risk_score Skor risiko banjir (output ML)
predicted_lst Prediksi LST (output ML)
tree_planted Status pohon (state untuk RL)
```

## 8. MODEL AI/ML & RL

### 8.1 ML Model 1 — Urban Heat Prediction

```
Aspek Detail
Algoritma XGBoost Regressor
Features (X) ndvi, building_density, land_cover_class,
population_density, elevation,
distance_to_green_space,
imperviousness_ratio
Target (y) land_surface_temperature (nilai LST aktual
dari Landsat)
Evaluation Target MAE < 1.5°C, R² > 0.
Training Day Day 3 (3 Maret 2026)
```

### 8.2 ML Model 2 — Flood Risk Prediction

```
Aspek Detail
Algoritma XGBoost Classifier
Features (X) elevation, slope, flow_accumulation,
distance_to_river,
land_cover_imperviousness,
rainfall_7day_avg, rainfall_max_event, ndvi,
soil_type_encoded
Target (y) flood_probability (0.0–1.0)
Evaluation Target AUC-ROC > 0.
Training Day Day 4 (4 Maret 2026)
```

### 8.3 RL Agent — PPO Tree Placement

```
Aspek Detail
Algoritma PPO (Proximal Policy Optimization)
Library Stable-Baselines
Policy MlpPolicy
Hyperparameter lr=3e-4, n_steps=2048, batch=64,
epochs=10, gamma=0.99, lambda=0.95,
clip=0.
Training Steps 300K–500K timesteps
Training Time ~30 menit (simplified 20x20 grid, CPU)
Grid Demo 20x20 grid
Grid Produksi 200x200 grid
Training Day Day 6 (6 Maret 2026)
```

## 9. SUMBER DATA

```
Data Sumber Penggunaan
Land Surface Temperature Landsat 8/9 Band 10 (via
GEE)
Input + label ML Heat
NDVI Sentinel-2 Band 4 & 8 (via
GEE)
Feature ML
Building Footprint OpenStreetMap Overpass Feature ML
Population Density BPS / WorldPop Feature ML, overlay analisis
Digital Elevation Model SRTM / NASADEM Feature Flood Risk
Rainfall Historical CHIRPS / BMKG API Feature Flood Risk
River & Drainage OpenStreetMap Overpass Feature Flood Risk
Land Cover Copernicus / ESA
WorldCover
Feature semua model
Historical Flood Events BNPB Open Data Label training Flood ML
Air Quality OpenAQ API Konteks tambahan (opsional)
Administrative Boundaries GADM Pembagian wilayah
```

## 10. ROADMAP IMPLEMENTASI

### 10.1 Overview Sprint (10 Hari Kerja)

```
Fase Hari Tanggal Fokus
Foundation Day 1 1 Mar 2026 Setup & Data
Collection
Foundation Day 2 2 Mar 2026 Database & Grid
Generation
```

```
Fase Hari Tanggal Fokus
AI Development Day 3 3 Mar 2026 ML Model 1 — Urban
Heat
AI Development Day 4 4 Mar 2026 ML Model 2 — Flood
Risk
AI Development Day 5 5 Mar 2026 Green Equity Index +
RL Design
AI Development Day 6 6 Mar 2026 RL Training + API
Integration
Frontend Day 7 7 Mar 2026 WebGIS Map Engine
Frontend Day 8 8 Mar 2026 Simulation Viewer +
Dashboard
Finalisasi Day 9 9 Mar 2026 Testing + Deploy +
Proposal
Finalisasi Day 10 10 Mar 2026 Demo Video +
Submit
```

### 10.2 Rincian Harian

#### Day 1 — Foundation & Data Collection (1 Maret 2026)

- Setup virtual environment Python (backend)
- Setup Next.js 14 project (frontend)
- Setup PostgreSQL + PostGIS + Redis
- GitHub repository setup + folder structure
- Download data via GEE Python API: Landsat 8/9, Sentinel-
- Download data: WorldPop, OSM, GADM, BNPB, CHIRPS
- Validasi ketersediaan dan kualitas data
  **Deliverable:** Semua raw data tersedia di storage lokal/GDrive, environment berjalan.

#### Day 2 — Database Schema & Grid Generation (2 Maret 2026)

- Desain dan implementasi PostGIS schema (tabel grid_cells, predictions, rl_results,
  cities)
- Script grid generation 100m x 100m untuk area kota pilot
- Reprojeksi dan resampling semua raster ke grid 100m

- Ekspor grid sebagai GeoTIFF dan ingest ke PostgreSQL
- Draft proposal: Judul, Latar Belakang, Rumusan Masalah
  **Deliverable:** Database terisi grid_cells, proposal draft v0.1.

#### Day 3 — ML Model 1: Urban Heat Prediction (3 Maret 2026)

- Pre-processing fitur ML (NDVI, building density, land cover, dll)
- Feature engineering dan normalisasi
- Training XGBoost Regressor
- Evaluasi: MAE < 1.5°C, R² > 0.
- Hyperparameter tuning jika perlu
- Simpan model .pkl dan evaluasi metrics
- Implementasi FastAPI endpoint /api/analysis/heat
  **Deliverable:** Model Heat terlatih + endpoint /api/analysis/heat berjalan.

#### Day 4 — ML Model 2: Flood Risk Prediction (4 Maret 2026)

- Pre-processing DEM, slope, flow accumulation, rainfall data
- Rasterisasi historical flood events ke binary label
- Training XGBoost Classifier
- Evaluasi: AUC-ROC > 0.
- Implementasi FastAPI endpoint /api/analysis/flood
- Endpoint scenario simulation curah hujan
  **Deliverable:** Model Flood terlatih + endpoint /api/analysis/flood + scenario sim.

#### Day 5 — Green Equity Index + RL Environment (5 Maret 2026)

- Kalkulasi Green Space Accessibility Score per grid
- Implementasi Population-Weighted Equity Analysis (Gini modification)
- K-Means Clustering (4 klaster): Green Privilege, Green Desert, Balanced, Rural
- Implementasi endpoint /api/analysis/equity
- Desain UrbanTreePlacementEnv(gym.Env) dengan Gymnasium
- Definisi state space, action space, reward function, transition model
- Unit testing environment
  **Deliverable:** Green Equity Index live + RL Environment terdesain dan diuji.

#### Day 6 — RL Training + Full API Integration (6 Maret 2026)

- RL Training: PPO 300K timesteps (simplified 20x20 grid)
- Monitoring reward curve, pastikan konvergensi
- Simpan model RL (.zip)
- Implementasi endpoint /api/simulate + /ws/simulation (WebSocket)

- Full API integration: semua endpoint live dan terkoneksi ke DB
- End-to-end API testing
  **Deliverable:** RL Model terlatih + semua API endpoint live.

#### Day 7 — WebGIS Frontend: Map Engine (7 Maret 2026)

- Setup MapLibre GL JS sebagai WebGIS engine
- Implementasi Layer System: Urban Heat, Flood Risk, Equity Clusters, Population
- Layer Controls: toggle on/off, opacity slider
- Info Popup saat klik grid cell (LST, Flood Risk, Green Score, Equity Cluster)
- Koneksi frontend ke backend API
  **Deliverable:** WebGIS map interaktif dengan 4 layer berfungsi.

#### Day 8 — Simulation Viewer + Dashboard + UI Polish (8 Maret 2026)

- Simulation Mode: budget slider + "Run RL Simulation" button
- WebSocket + Canvas animation: penempatan pohon real-time
- Live stats bar: perubahan suhu, risiko banjir, equity score
- Before/After toggle slider
- Export GeoJSON, CSV, PDF Report
- Analytics Dashboard: City Equity Score, Avg LST, % High Flood Risk
- UI Polish: dark mode, loading states, legenda, responsif
  **Deliverable:** UI/UX lengkap, simulation viewer berjalan, export berfungsi.

#### Day 9 — Testing, Deploy & Proposal Final (9 Maret 2026)

- Integration testing end-to-end
- Performance testing: waktu respons API < 2 detik
- Deploy backend ke Railway/Render
- Deploy database ke Supabase
- Deploy frontend ke Vercel
- Uji stabilitas WebSocket di cloud
- Finalisasi proposal: Tujuan, Manfaat, Solusi, Fitur, Tech, Implementasi, Mockup
  **Deliverable:** Aplikasi live di cloud + proposal final v1.0.

#### Day 10 — Demo Video + Submit (10 Maret 2026)

- Record demo video ~10 menit (highlight: RL simulation real-time)
- GitHub final checklist: README, requirements.txt, .env.example, docs
- Persiapan lokal backup demo (jika hosting bermasalah)
- **SUBMIT**

**Deliverable:** Aplikasi tersubmit + demo video + dokumentasi lengkap.

### 10.3 Milestone Pasca-Submission

```
Tanggal Milestone
10 Mar 2026 Submission selesai
11–21 Mar 2026 Refinement & polish pasca-submission
22 Mar 2026 Technical Meeting — siapkan jawaban teknis
mendalam
23 Mar – 4 Apr 2026 Persiapan pitch deck + rehearsal
5 Apr 2026 PITCHING DAY
```

## 11. TARGET PENGGUNA

### 11.1 Primary Users

```
Segmen Kebutuhan Fitur Relevan
Urban Planner / BAPPEDA Analisis berbasis data untuk
RTRW dan RTH
Semua 4 modul, export report
Pembuat Kebijakan
(Eksekutif)
Overview kondisi kota dan
prioritas intervensi
Dashboard, City Equity Score
Dinas Lingkungan Hidup Pemetaan Green Desert dan
rencana penghijauan
Green Equity Index, RL
Simulation
```

### 11.2 Secondary Users

- Akademisi dan peneliti urban & lingkungan
- Jurnalis dan LSM lingkungan
- Konsultan perencanaan kota

## 12. KEUNGGULAN KOMPETITIF

### 12.1 Analisis Kompetitor

```
Platform Kekurangan vs UrbanInsight AI
Google Earth Engine Tidak accessible sebagai web platform, tidak
ada RL simulation
BNPB inaRISK Hanya modul banjir, tidak ada ML prediktif,
tidak ada rekomendasi
Urban Climate Analyzer (riset) Tidak dalam bentuk production-ready
WebGIS multi-user
TreePlotter (US) Hanya inventaris pohon, tidak ada optimasi
RL
```

### 12.2 4 Keunggulan Unik UrbanInsight AI

1. **RL-Powered Prescriptive Simulation** — Satu-satunya di kelasnya yang memberikan
   rekomendasi tindakan, bukan hanya menampilkan kondisi.
2. **Multi-Objective Optimization** — RL agent mengoptimasi 3 tujuan sekaligus (suhu +
   banjir + green equity) dengan constraint anggaran.
3. **Grid-Based Urban Simulation** — Kota direpresentasikan sebagai grid spasial 100m,
   memungkinkan granularitas tinggi.
4. **Real-Time Before vs After Viewer** — Pengguna dapat melihat proyeksi perubahan di
   peta secara langsung saat simulasi berjalan.

## 13. RISIKO & MITIGASI

```
No Risiko Probabilitas Dampak Strategi
Mitigasi
1 GEE data
download
lambat
Sedang Tinggi Mulai Day 1
pagi, export ke
Google Drive
2 RL training tidak
konvergen
Sedang Tinggi Gunakan
simplified 20x
```

**No Risiko Probabilitas Dampak Strategi
Mitigasi**
grid, target 30
menit training
3 Model ML
akurasi di bawah
target
Rendah Sedang Augment
dengan
synthetic data
atau transfer
learning
4 WebSocket tidak
stabil di cloud
Sedang Tinggi Test di Railway
sejak Day 9,
siapkan polling
fallback
5 Model .pkl
terlalu besar
Rendah Sedang Compress
model, simpan
di cloud storage
6 Developer
kewalahan
(scope)
Sedang Tinggi Drop K-Means
equity, simplify
RL grid,
prioritaskan
demo core
7 Hosting crash
saat pitching
Rendah Sangat Tinggi Siapkan
recorded demo
video + local
demo
environment
8 Data satelit tidak
tersedia untuk
kota pilot
Rendah Tinggi Siapkan kota
backup, validasi
data Day 1

## 14. RENCANA MASA DEPAN

### V2.0 — Q3 2026

- **IoT Sensor Integration:** Koneksi ke sensor suhu dan curah hujan real-time untuk model
  yang lebih akurat
- **Multi-City Support:** Dashboard perbandingan antar kota secara bersamaan

### V3.0 — Q1 2027

- **Open API:** Endpoint publik untuk integrasi dengan sistem pemerintah dan platform pihak
  ketiga
- **Mobile Application:** Aplikasi native iOS/Android untuk field inspector dan pemantauan
  lapangan

### Jangka Panjang

- **Citizen Science Integration:** Crowdsourcing data lapangan dari masyarakat
- **Policy Scenario Builder:** Simulasi dampak kebijakan tata ruang sebelum
  diimplementasi
- **Carbon Credit Estimation:** Kalkulasi nilai karbon dari rencana penghijauan optimal

## 15. KESIMPULAN

UrbanInsight AI merepresentasikan lompatan signifikan dari cara kota-kota Indonesia selama ini
merencanakan intervensi lingkungan. Dengan menggabungkan:

- **Data satelit resolusi tinggi** yang diproses via Google Earth Engine
- **Machine learning berbasis XGBoost** untuk prediksi suhu dan risiko banjir
- **Green Equity Index** yang mengukur ketimpangan secara spasial dan kuantitatif
- **Reinforcement Learning (PPO)** yang memberikan rekomendasi optimal berbasis
  multi-objective
  UrbanInsight AI mentransformasi cara perencana kota mengambil keputusan: dari intuisi
  berbasis pengalaman menjadi **evidence-based prescriptive planning** yang diperkuat AI.
  Dalam 10 hari sprint yang terencana dengan ketat, platform ini akan dibangun dari nol hingga
  siap dipresentasikan — dengan fondasi teknis yang solid, interface yang intuitif, dan fitur
  simulasi yang belum ada sebelumnya di ekosistem tools perencanaan kota Indonesia.

_"Don't just see the problem. Solve it."_
**Dokumen ini disusun sebagai Rencana Pelaksanaan dan Desain (RPD) untuk proyek
UrbanInsight AI.
Tanggal: 1 Maret 2026**
_Prepared by: Yudistira Azfa | UrbanInsight AI Team_
