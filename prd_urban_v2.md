# RENCANA PELAKSANAAN DAN DESAIN (RPD) v2.0

## UrbanInsight AI

## Platform WebGIS Berbasis AI untuk Perencanaan Kota Berkelanjutan

> _"Don't just see the problem. Solve it."_

---

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
13. Keterbatasan & Asumsi Kritis
14. Risiko & Mitigasi
15. Keamanan & Privasi Data
16. Rencana Masa Depan
17. Kesimpulan

---

## 1. INFORMASI PROYEK

| Atribut         | Detail                                                                            |
| --------------- | --------------------------------------------------------------------------------- |
| Nama Proyek     | UrbanInsight AI                                                                   |
| Kategori        | Platform WebGIS + AI untuk Smart City                                             |
| Domain          | Urban Planning, Geospatial AI, Environmental Tech                                 |
| Tanggal Mulai   | 1 Maret 2026                                                                      |
| Target Selesai  | 10 Maret 2026                                                                     |
| Target Pitching | 5 April 2026                                                                      |
| Tipe Aplikasi   | Web Application (Full-Stack)                                                      |
| Tim             | 3 orang (1 ML/AI Engineer, 1 Backend/Geospatial Engineer, 1 Frontend/UI Engineer) |
| Status          | Aktif — Development Sprint                                                        |

---

## 2. LATAR BELAKANG

Urbanisasi yang masif di kota-kota Indonesia menghadirkan tantangan baru yang kompleks dan saling berkaitan. Kota-kota besar seperti Jakarta, Surabaya, Bandung, dan Medan mengalami tekanan ekosistem yang serius akibat pertumbuhan populasi, alih fungsi lahan, dan minimnya ruang terbuka hijau (RTH).

Permasalahan kunci yang dihadapi antara lain:

- **Urban Heat Island (UHI):** Suhu permukaan di kawasan urban dapat mencapai 1–7°C lebih tinggi dibandingkan area rural akibat dominasi beton, aspal, dan minimnya vegetasi (Rizwan et al., 2008; Oke, 1982).
- **Risiko Banjir:** Curah hujan ekstrem dikombinasikan dengan rendahnya kapasitas drainase dan tingginya imperviousness lahan menciptakan banjir periodik yang merendam kawasan padat penduduk.
- **Ketimpangan Ruang Terbuka Hijau:** Akses terhadap RTH tidak merata — kelurahan padat miskin sering kali menjadi "green desert" yang justru paling membutuhkan intervensi hijau.
- **Ketidaksiapan Tools Perencanaan:** Perencana kota dan pembuat kebijakan tidak memiliki platform berbasis data dan kecerdasan buatan yang dapat memberikan rekomendasi tindakan konkret.

Saat ini, tools yang tersedia (seperti BNPB inaRISK, platform GIS konvensional, atau hasil riset akademik) hanya bersifat deskriptif atau prediktif — menampilkan kondisi yang ada, tetapi tidak memberikan jawaban atas pertanyaan yang paling kritis:

> **"Di mana harus bertindak, dan tindakan apa yang memberikan dampak paling besar?"**

**UrbanInsight AI hadir untuk menjawab celah tersebut.** Dengan menggabungkan machine learning berbasis data satelit, analisis geospasial resolusi tinggi, dan reinforcement learning (RL) untuk simulasi perencanaan, UrbanInsight AI tidak sekadar memvisualisasikan masalah — tetapi secara aktif merekomendasikan solusi yang optimal.

---

## 3. PERNYATAAN MASALAH

### 3.1 Problem Statement Utama

> Perencana kota tidak memiliki akses terhadap platform terintegrasi berbasis AI yang mampu secara bersamaan menganalisis risiko iklim urban (panas, banjir, ketimpangan hijau) dan merekomendasikan intervensi spasial yang optimal dengan mempertimbangkan keterbatasan anggaran.

### 3.2 Gap yang Diidentifikasi

| Dimensi Masalah   | Kondisi Saat Ini                          | Gap                                                        |
| ----------------- | ----------------------------------------- | ---------------------------------------------------------- |
| Urban Heat Island | Tidak ada peta LST real-time berbasis ML  | Tidak ada baseline untuk intervensi berbasis data          |
| Risiko Banjir     | Peta banjir statis dan makro              | Tidak ada flood risk scoring probabilistik per grid 100m   |
| Ketimpangan RTH   | Tidak diukur secara spasial & kuantitatif | Tidak diketahui kelurahan mana yang paling kekurangan RTH  |
| Tools Proaktif    | Tools bersifat deskriptif/prediktif saja  | Tidak ada rekomendasi spasial berbasis AI untuk intervensi |

### 3.3 Dampak dari Gap Tersebut

- Anggaran penghijauan kota tidak tepat sasaran
- Masyarakat miskin urban menanggung beban UHI dan banjir terbesar
- Perencana kota mengambil keputusan berdasarkan intuisi, bukan data
- Kerugian sosial-ekonomi akibat bencana urban yang seharusnya bisa dimitigasi

---

## 4. TUJUAN PROYEK

### 4.1 Tujuan Umum

Membangun platform WebGIS berbasis AI yang membantu perencana kota dan pembuat kebijakan dalam menganalisis risiko iklim urban secara terpadu dan menerima rekomendasi intervensi spasial yang optimal.

### 4.2 Tujuan Khusus

1. **Mengembangkan model ML** untuk memprediksi Land Surface Temperature (LST) per grid 100m dengan target akurasi MAE < 1.5°C dan R² > 0.85.
2. **Mengembangkan model ML** untuk menghitung probabilitas risiko banjir per grid dengan target AUC-ROC > 0.80.
3. **Mengembangkan Green Equity Index** berbasis Gini Coefficient yang mengukur ketimpangan akses RTH secara spasial dan kuantitatif.
4. **Mengembangkan RL agent** (PPO) yang mampu merekomendasikan penempatan pohon optimal dengan multi-objective optimization (suhu + banjir + green equity + budget).
5. **Membangun platform WebGIS** yang accessible, interaktif, dan real-time dengan fitur simulasi before/after.
6. **Mendeploy aplikasi** ke lingkungan produksi yang stabil dan siap dipresentasikan.

### 4.3 Kriteria Keberhasilan (Success Metrics)

| Kriteria                | Target                                            |
| ----------------------- | ------------------------------------------------- |
| Akurasi Heat Prediction | MAE < 1.5°C, R² > 0.85                            |
| Akurasi Flood Risk      | AUC-ROC > 0.80, F1-Score > 0.75                   |
| RL Convergence          | Reward meningkat konsisten dalam 300K timesteps   |
| Waktu Respons API       | < 2 detik untuk query grid                        |
| Simulasi Real-time      | WebSocket streaming berjalan tanpa lag signifikan |
| Demo Stability          | Aplikasi berjalan stabil saat pitching            |

---

## 5. RUANG LINGKUP

### 5.1 Dalam Lingkup (In Scope)

- Platform WebGIS berbasis web (browser-based, no installation)
- 4 modul AI: Urban Heat Prediction, Flood Risk, Green Equity Index, RL Tree Placement
- Kota pilot: **Kota Surabaya** (backup: Kota Bandung)
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

### 5.3 Pemilihan Kota Pilot

**Kota Surabaya** dipilih sebagai kota pilot berdasarkan pertimbangan berikut:

| Kriteria               | Surabaya         | Alasan                                                                           |
| ---------------------- | ---------------- | -------------------------------------------------------------------------------- |
| Ketersediaan Data GEE  | ✅ Tinggi        | Cakupan Landsat 8/9 dan Sentinel-2 lengkap, minim cloud cover pada musim kemarau |
| Data BNPB Flood Events | ✅ Memadai       | Riwayat banjir terdokumentasi dengan baik (2019–2025)                            |
| Data OSM               | ✅ Lengkap       | Komunitas OSM aktif, building footprint coverage tinggi                          |
| Relevansi UHI          | ✅ Sangat Tinggi | Kota terbesar kedua Indonesia, UHI signifikan                                    |
| Relevansi Banjir       | ✅ Sangat Tinggi | Banjir periodik di kawasan pesisir dan dataran rendah                            |
| Ketimpangan RTH        | ✅ Terukur       | Disparitas RTH antara Surabaya Utara dan Selatan                                 |

**Kota backup: Bandung** — dipilih karena topografi variatif (highland city), data GEE memadai, dan isu UHI yang juga signifikan.

### 5.4 Asumsi

- Data satelit dari Google Earth Engine tersedia dan dapat diunduh dalam timeline
- Model ML dapat dilatih dengan data historis yang memadai
- RL agent dapat didemonstrasikan dengan grid yang disimplifikasi (20×20 untuk demo)
- Tim 3 orang bekerja paralel sesuai pembagian role selama 10 hari kerja

---

## 6. SOLUSI & FITUR UTAMA

UrbanInsight AI dirancang sebagai platform **prescriptive analytics** — melampaui deskriptif dan prediktif untuk memberikan rekomendasi tindakan konkret.

### 6.1 Modul 1 — Satellite-Based Urban Heat Prediction

**Deskripsi:** Peta suhu permukaan (LST) berbasis data satelit Landsat 8/9 per grid 100m, diprediksi menggunakan XGBoost Regressor.

**Fitur Output WebGIS:**

- Heatmap choropleth (merah >38°C → biru <28°C)
- Hotspot detection otomatis
- Hover tooltip: LST aktual vs prediksi, NDVI, land cover
- Time slider perbandingan multi-temporal

**Data Input:**

| Sumber                | Data                       | Penggunaan      |
| --------------------- | -------------------------- | --------------- |
| Landsat 8/9 Band 10   | LST                        | Target variable |
| Sentinel-2 Band 4 & 8 | NDVI                       | Feature         |
| OpenStreetMap         | Building footprint density | Feature         |
| BPS/WorldPop          | Population density         | Feature         |

### 6.2 Modul 2 — Flood Risk Prediction

**Deskripsi:** Scoring probabilitas risiko banjir per grid (0.0–1.0) menggunakan XGBoost Classifier dengan 9 fitur geospasial.

**Kategori Risiko:**

| Kategori      | Range Skor | Warna Peta |
| ------------- | ---------- | ---------- |
| Rendah        | 0.0–0.3    | Hijau      |
| Sedang        | 0.3–0.6    | Kuning     |
| Tinggi        | 0.6–0.8    | Oranye     |
| Sangat Tinggi | 0.8–1.0    | Merah      |

**Fitur Output WebGIS:**

- Risk zone map choropleth 4 kategori
- Radar chart faktor risiko per grid
- Scenario simulation: "Jika curah hujan +50mm, area berisiko tinggi bertambah X%"
- Overlay dengan data kepadatan populasi

**Data Input:**

| Sumber                    | Data                         | Penggunaan     |
| ------------------------- | ---------------------------- | -------------- |
| SRTM/NASADEM              | Digital Elevation Model      | Feature        |
| CHIRPS/BMKG               | Rainfall historis            | Feature        |
| OpenStreetMap             | Jarak ke sungai dan drainase | Feature        |
| Copernicus/ESA WorldCover | Land cover                   | Feature        |
| BNPB                      | Historical flood events      | Label training |

### 6.3 Modul 3 — Green Equity Index

**Deskripsi:** Pengukuran ketimpangan akses RTH secara spasial menggunakan modified Gini Coefficient dan K-Means Clustering.

**Metodologi 3-Step:**

1. **Green Space Accessibility Score:** Jarak ke RTH (50%) + luas RTH dalam radius 500m (30%) + kualitas RTH (20%)
2. **Population-Weighted Equity Analysis:** Equity Index 0–100 (0 = tidak merata, 100 = merata sempurna)
3. **K-Means Clustering (4 klaster):**

| Klaster           | Deskripsi                         | Implikasi                          |
| ----------------- | --------------------------------- | ---------------------------------- |
| Green Privilege   | Akses RTH tinggi, populasi rendah | Potensi over-served                |
| Green Desert      | Akses RTH rendah, populasi tinggi | **Prioritas intervensi tertinggi** |
| Balanced Access   | Distribusi seimbang               | Target maintenance                 |
| Low Density Rural | Area pinggiran, kepadatan rendah  | Prioritas rendah                   |

**Fitur Output WebGIS:**

- Equity Cluster Map berdasarkan 4 klaster
- City Equity Score (0–100)
- Highlight "Green Desert" areas
- Perbandingan antar kelurahan/kecamatan
- Overlay dengan data pendapatan

### 6.4 Modul 4 — RL Optimal Tree Placement (Fitur Unggulan)

**Deskripsi:** Fitur paling inovatif dari UrbanInsight AI. RL agent berbasis PPO (Proximal Policy Optimization) secara cerdas memilih lokasi penanaman pohon yang memaksimalkan dampak bersamaan terhadap 3 tujuan: penurunan suhu, pengurangan risiko banjir, dan peningkatan green equity — dengan constraint budget pohon.

**RL Environment Design:**

| Aspek        | Detail                                                                                 |
| ------------ | -------------------------------------------------------------------------------------- |
| Class        | `UrbanTreePlacementEnv(gym.Env)`                                                       |
| State Space  | Grid N×N, per cell: `[LST, flood_risk, green_score, population_density, tree_planted]` |
| Action Space | Discrete — pilih 1 grid cell untuk ditanami pohon (dengan masking)                     |
| Episode      | 1 siklus perencanaan, max steps = budget (misal 100 pohon)                             |

#### 6.4.1 Reward Function (Multi-Objective) & Justifikasi

```
reward = (0.35 × delta_T_reduction) + (0.30 × delta_Flood_reduction) +
         (0.25 × delta_Equity_improvement) + (-0.10 × cost_penalty)
```

**Justifikasi Bobot:**

| Komponen                   | Bobot | Justifikasi                                                                                                                                                                                                                                                                              |
| -------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `delta_T_reduction`        | 0.35  | Penurunan UHI adalah dampak paling langsung dan terukur dari penanaman pohon. Studi empiris menunjukkan 1 pohon dewasa dapat menurunkan suhu ambient 0.5–2°C dalam radius 30m (Bowler et al., 2010; Zölch et al., 2016). Bobot tertinggi karena merupakan outcome paling evidence-based. |
| `delta_Flood_reduction`    | 0.30  | Pohon meningkatkan infiltrasi air dan mengurangi surface runoff hingga 20–40% (Berland et al., 2017). Bobot kedua karena dampaknya signifikan namun lebih lambat dari reduksi suhu.                                                                                                      |
| `delta_Equity_improvement` | 0.25  | Keadilan spasial RTH adalah tujuan sosial yang tidak kalah penting. Bobot lebih rendah karena metrik ini adalah proksi (jarak + distribusi), bukan pengukuran langsung kualitas hidup.                                                                                                   |
| `cost_penalty`             | -0.10 | Penalty ringan untuk mencegah penempatan berlebih di area yang sudah hijau. Sengaja rendah agar agent tidak over-optimize pada efisiensi biaya dan mengabaikan tujuan lingkungan.                                                                                                        |

> **Catatan:** Bobot ini merupakan _starting point_ berdasarkan literatur. Dalam implementasi, bobot dapat di-tune oleh pengguna (urban planner) sesuai prioritas kebijakan daerah masing-masing melalui UI slider.

#### 6.4.2 Transition Model — Dampak Penanaman Pohon

Saat RL agent menanam pohon di grid cell `(i, j)`, state berubah sebagai berikut:

| State Variable      | Perubahan                                          | Basis                                                  |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `LST[i,j]`          | Turun 0.5–1.5°C (proporsional terhadap LST awal)   | Meta-analisis 49 studi UHI (Bowler et al., 2010)       |
| `LST[neighbors]`    | Turun 0.1–0.3°C (kernel decay radius 200m)         | Efek kanopi terhadap suhu ambient (Zölch et al., 2016) |
| `flood_risk[i,j]`   | Turun 5–15% (proporsional terhadap imperviousness) | Kapasitas infiltrasi increase (Berland et al., 2017)   |
| `green_score[i,j]`  | Meningkat berdasarkan coverage formula             | Recalculated dari proximity & area                     |
| `tree_planted[i,j]` | 0 → 1                                              | Binary state flag                                      |

> **Catatan:** Nilai-nilai ini adalah _simplified estimates_ yang di-kalibrasi dari literatur. Untuk produksi, dapat ditingkatkan dengan model biofisik yang lebih detail (lihat Section 13 — Keterbatasan).

**Fitur Output WebGIS — Simulation Mode:**

- User pilih kota + budget (10–500 pohon)
- Animasi real-time penempatan pohon via WebSocket
- Live stats bar: perubahan suhu, risiko banjir, equity score
- Before/After toggle slider untuk komparasi kondisi
- Export: GeoJSON, CSV, PDF Report

---

## 7. ARSITEKTUR SISTEM

### 7.1 Arsitektur 3-Tier

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│  React JS (Vite) + TailwindCSS                              │
│  MapLibre GL JS (WebGIS Engine)                             │
│  Recharts + D3.js (Analytics)                               │
│  HTML5 Canvas + WebSocket (Simulation Viewer)               │
├─────────────────────────────────────────────────────────────┤
│                  BACKEND API LAYER (FastAPI)                 │
│  /api/map  |  /api/grid  |  /api/analysis  |  /api/simulate│
│  /api/export  |  /ws/simulation (WebSocket)                 │
├─────────────────────────────────────────────────────────────┤
│                  AI / ML SERVICE LAYER                      │
│  XGBoost (Heat Prediction, Flood Risk) + scikit-learn       │
│  Gymnasium + Stable-Baselines3 PPO (RL Engine)              │
│  Rasterio + GeoPandas + Shapely (Geospatial Processing)     │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE LAYER                            │
│  PostgreSQL + PostGIS (grid_cells, predictions, rl_results) │
│  Redis (Cache GeoJSON, RL results, ML scores)               │
├─────────────────────────────────────────────────────────────┤
│                 EXTERNAL DATA SOURCES                       │
│  Google Earth Engine API | BMKG API | OpenAQ API            │
│  OSM Overpass | SRTM/NASADEM | WorldPop | BNPB | CHIRPS    │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Tech Stack Lengkap

| Layer            | Teknologi                                                                              |
| ---------------- | -------------------------------------------------------------------------------------- |
| Frontend         | React JS (Vite), TailwindCSS, MapLibre GL JS, Recharts, D3.js, HTML5 Canvas, WebSocket |
| Backend          | FastAPI (Python)                                                                       |
| ML Models        | XGBoost, scikit-learn                                                                  |
| RL Framework     | Gymnasium, Stable-Baselines3 (PPO)                                                     |
| Geospatial       | Rasterio, GeoPandas, Shapely                                                           |
| Satellite Data   | Google Earth Engine Python API                                                         |
| Database         | PostgreSQL + PostGIS                                                                   |
| Cache            | Redis                                                                                  |
| Export           | ReportLab (PDF), Pandas (CSV)                                                          |
| Containerization | Docker + Docker Compose                                                                |
| Hosting          | Railway/Render (Backend), Supabase (DB), Vercel (Frontend)                             |
| Version Control  | GitHub                                                                                 |

### 7.3 Data Foundation — Grid Spasial 100m x 100m

Seluruh sistem dibangun di atas grid spasial resolusi 100m x 100m. Setiap grid cell menyimpan:

| Field                     | Tipe             | Deskripsi                              |
| ------------------------- | ---------------- | -------------------------------------- |
| `grid_id`                 | VARCHAR (PK)     | Identifier unik grid cell              |
| `center_coord`            | GEOMETRY (Point) | Koordinat pusat (lat, lon)             |
| `lst`                     | FLOAT            | Land Surface Temperature (°C)          |
| `ndvi`                    | FLOAT            | Normalized Difference Vegetation Index |
| `land_cover_class`        | INT              | Kelas tutupan lahan                    |
| `elevation`               | FLOAT            | Ketinggian (m dpl)                     |
| `building_density`        | FLOAT            | Kepadatan bangunan (%)                 |
| `population_density`      | FLOAT            | Kepadatan penduduk (jiwa/km²)          |
| `rainfall_accumulation`   | FLOAT            | Akumulasi curah hujan (mm)             |
| `distance_to_green_space` | FLOAT            | Jarak ke RTH terdekat (m)              |
| `flood_risk_score`        | FLOAT            | Skor risiko banjir (output ML)         |
| `predicted_lst`           | FLOAT            | Prediksi LST (output ML)               |
| `tree_planted`            | BOOLEAN          | Status pohon (state untuk RL)          |

---

## 8. PENGELOLAAN DATA & MODEL RL (API-DRIVEN APPROACH)

### 8.1 API Data Pipeline & Downscaling (Microclimate Synthesis)
Alih-alih melatih model ML dari awal, UrbanInsight AI menggunakan data prediktif dan historis pihak ketiga yang di-downscale menggunakan filter spasial deterministik pada backend.

| Modul                | Sumber Data API                                          | Filter Spasial Deterministic (Downscaling 100m)                                | Target Output Per Grid                              |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| **Urban Heat (LST)** | Open-Meteo (Suhu base level)                             | `Suhu_Dasar + (Building_Density × 3.0°C) - (Green_Density × 2.5°C)`            | Peta LST resolusi tinggi dengan efek *microclimate* |
| **Flood Risk**       | Open-Meteo (Curah hujan & Soil Moisture), Elevation DEM  | `Normalized(Rainfall + Soil_Moisture + Proximity_to_River + Imperviousness)`   | Peta Risiko Banjir berskala probabilistik (0.0 - 1.0) |
| **Green Equity**     | OpenStreetMap (Overpass API)                             | Radius dan luasan poligon tipe `leisure=park`, `natural=wood` dll per grid     | Indeks Akses RTH per wilayah                        |

### 8.2 Konstruksi State Environment RL

RL Agent tidak menyadari apakah matriks state berasal dari model ML atau komputasi API deterministik. Environment disusun pada backend secara dinamis.

| Komponen State      | Deskripsi Data                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `LST Matrix`        | Grid 2D berisi nilai hasil komputasi *microclimate synthesis*.                           |
| `Flood Matrix`      | Grid 2D berisi skor kerentanan banjir (0-1).                                             |
| `Green Matrix`      | Grid 2D berisi jarak/skor normalisasi terhadap RTH terdekat.                             |
| `Tree Placement`    | Grid 2D berjenis *boolean* (0 atau 1) melacak lokasi pohon yang sudah ditanam oleh agent.|

### 8.3 RL Agent — PPO Tree Placement

Agent tetap dirancang mengoptimalkan multi-objective dengan action berupa pemilihan titik grid untuk penanaman pohon.

| Aspek            | Detail                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| Algoritma        | PPO (Proximal Policy Optimization)                                                                         |
| Library          | Stable-Baselines3                                                                                          |
| Policy           | `MlpPolicy` (Flattened State) atau `CnnPolicy` (Spatial 2D State Image-like)                               |
| Transition Model | Mengurangi nilai `LST`, `Flood Risk`, dan meningkatkan `Green Equity` secara lokal (misal pada radius 2 grid) |
| Reward Function  | `(0.35 × ΔT) + (0.30 × ΔFlood) + (0.25 × ΔEquity) - (0.10 × Cost_Penalty)`                                 |
| Training Steps   | 100K–300K timesteps (Training akan sangat ringan dan cepat karena no ML prediction overhead)               |
| Simulation Demo  | Pilihan antara 20×20 atau 50x50 grid via WebSockets                                                        |

---

## 9. SUMBER DATA

| Data                      | Sumber                          | Penggunaan                   | Ketersediaan                 |
| ------------------------- | ------------------------------- | ---------------------------- | ---------------------------- |
| Land Surface Temperature  | Landsat 8/9 Band 10 (via GEE)   | Input + label ML Heat        | ✅ Verified                  |
| NDVI                      | Sentinel-2 Band 4 & 8 (via GEE) | Feature ML                   | ✅ Verified                  |
| Building Footprint        | OpenStreetMap Overpass          | Feature ML                   | ✅ Verified                  |
| Population Density        | BPS / WorldPop                  | Feature ML, overlay analisis | ✅ Verified                  |
| Digital Elevation Model   | SRTM / NASADEM                  | Feature Flood Risk           | ✅ Verified                  |
| Rainfall Historical       | CHIRPS / BMKG API               | Feature Flood Risk           | ✅ Verified                  |
| River & Drainage          | OpenStreetMap Overpass          | Feature Flood Risk           | ✅ Verified                  |
| Land Cover                | Copernicus / ESA WorldCover     | Feature semua model          | ✅ Verified                  |
| Historical Flood Events   | BNPB Open Data                  | Label training Flood ML      | ⚠️ Perlu verifikasi kualitas |
| Air Quality               | OpenAQ API                      | Konteks tambahan (opsional)  | ✅ Verified                  |
| Administrative Boundaries | GADM                            | Pembagian wilayah            | ✅ Verified                  |

---

## 10. ROADMAP IMPLEMENTASI

### 10.1 Struktur Tim & Pembagian Peran

| Role                            | Tanggung Jawab Utama                                                                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ML/AI Engineer**              | Data pipeline GEE, training ML models (Heat & Flood), Green Equity Index, RL environment design & training, model evaluation                       |
| **Backend/Geospatial Engineer** | FastAPI endpoints, PostGIS setup, grid generation, geospatial processing (Rasterio, GeoPandas), WebSocket, Redis cache, deployment                 |
| **Frontend/UI Engineer**        | React JS (Vite) setup, MapLibre GL JS integration, layer system, simulation viewer (Canvas + WebSocket), analytics dashboard, responsive UI polish |

### 10.2 Overview Sprint (10 Hari Kerja)

| Fase           | Hari   | Tanggal     | Fokus                          |
| -------------- | ------ | ----------- | ------------------------------ |
| Foundation     | Day 1  | 1 Mar 2026  | Setup & Data Collection        |
| Foundation     | Day 2  | 2 Mar 2026  | Database & Grid Generation     |
| AI Development | Day 3  | 3 Mar 2026  | ML Model 1 — Urban Heat        |
| AI Development | Day 4  | 4 Mar 2026  | ML Model 2 — Flood Risk        |
| AI Development | Day 5  | 5 Mar 2026  | Green Equity Index + RL Design |
| Integration    | Day 6  | 6 Mar 2026  | RL Training + API Integration  |
| Frontend       | Day 7  | 7 Mar 2026  | WebGIS Map Engine              |
| Frontend       | Day 8  | 8 Mar 2026  | Simulation Viewer + Dashboard  |
| Finalisasi     | Day 9  | 9 Mar 2026  | Testing + Deploy + Proposal    |
| Finalisasi     | Day 10 | 10 Mar 2026 | Demo Video + Submit            |

### 10.3 Rincian Harian (Paralel 3 Orang)

#### Day 1 — Foundation & Data Collection (1 Maret 2026)

| PIC               | Task                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Download data via GEE Python API: Landsat 8/9, Sentinel-2. Download WorldPop, CHIRPS, BNPB. Validasi kualitas data. |
| Backend Engineer  | Setup virtual environment Python (FastAPI), PostGIS + Redis. GitHub repo + folder structure + Docker Compose.       |
| Frontend Engineer | Setup React JS project (Vite), design system (TailwindCSS), component library, routing structure (React Router).    |

**Deliverable:** Semua raw data tersedia, environment berjalan, frontend skeleton ready.

#### Day 2 — Database Schema & Grid Generation (2 Maret 2026)

| PIC               | Task                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Pre-processing raster data: reprojeksi, resampling ke 100m, extract features per grid.    |
| Backend Engineer  | Desain PostGIS schema, script grid generation 100m×100m, ingest grid_cells ke PostgreSQL. |
| Frontend Engineer | MapLibre GL JS setup, base map, grid layer rendering prototype, layer toggle system.      |

**Deliverable:** Database terisi grid_cells, frontend menampilkan base map.

#### Day 3 — ML Model 1: Urban Heat Prediction (3 Maret 2026)

| PIC               | Task                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Feature engineering, training XGBoost Regressor, evaluasi MAE/R²/RMSE, hyperparameter tuning, simpan model .pkl. |
| Backend Engineer  | Implementasi FastAPI endpoint `/api/analysis/heat`, koneksi ke DB, response GeoJSON format.                      |
| Frontend Engineer | Heatmap choropleth layer, hover tooltip (LST, NDVI, land cover), hotspot detection UI.                           |

**Deliverable:** Model Heat terlatih + endpoint `/api/analysis/heat` + heatmap layer di frontend.

#### Day 4 — ML Model 2: Flood Risk Prediction (4 Maret 2026)

| PIC               | Task                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Pre-processing DEM/slope/flow, rasterisasi flood labels, training XGBoost Classifier, evaluasi AUC-ROC/F1. |
| Backend Engineer  | Endpoint `/api/analysis/flood`, scenario simulation endpoint (curah hujan variable).                       |
| Frontend Engineer | Flood risk choropleth layer, radar chart faktor risiko, scenario simulation UI (slider curah hujan).       |

**Deliverable:** Model Flood terlatih + endpoint + flood layer + scenario simulation di frontend.

#### Day 5 — Green Equity Index + RL Environment (5 Maret 2026)

| PIC               | Task                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Green Space Accessibility Score, Gini modification, K-Means clustering, RL environment design (`UrbanTreePlacementEnv`), unit test env. |
| Backend Engineer  | Endpoint `/api/analysis/equity`, grid data enrichment, API documentation (OpenAPI/Swagger).                                             |
| Frontend Engineer | Equity cluster map layer, City Equity Score card, Green Desert highlight, antar-kelurahan comparison chart.                             |

**Deliverable:** Green Equity Index live + RL Environment terdesain dan diuji.

#### Day 6 — RL Training + Full API Integration (6 Maret 2026)

| PIC               | Task                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| ML/AI Engineer    | RL Training PPO 300K timesteps (20×20 grid), monitoring reward curve, simpan model .zip.               |
| Backend Engineer  | Endpoint `/api/simulate` + `/ws/simulation` (WebSocket), full API integration, end-to-end API testing. |
| Frontend Engineer | Simulation Mode UI: budget slider, Run button, WebSocket connection, Canvas animation prototype.       |

**Deliverable:** RL Model terlatih + semua API endpoint live + simulation UI prototype.

#### Day 7 — WebGIS Frontend: Map Engine (7 Maret 2026)

| PIC               | Task                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Model optimization, feature importance analysis (SHAP), model documentation.                                                 |
| Backend Engineer  | Performance optimization, Redis caching, API response pagination, error handling.                                            |
| Frontend Engineer | Full layer system integration (Heat, Flood, Equity, Population), layer controls (toggle, opacity), info popup per grid cell. |

**Deliverable:** WebGIS map interaktif dengan 4+ layer berfungsi.

#### Day 8 — Simulation Viewer + Dashboard + UI Polish (8 Maret 2026)

| PIC               | Task                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ML/AI Engineer    | Proposal draft: Latar Belakang, Metodologi, Hasil, kontribusi teknis.                                                          |
| Backend Engineer  | Export endpoints: GeoJSON, CSV, PDF Report (ReportLab).                                                                        |
| Frontend Engineer | Simulation animation (Canvas), live stats bar, Before/After toggle, Analytics Dashboard, dark mode, loading states, responsif. |

**Deliverable:** UI/UX lengkap, simulation viewer berjalan, export berfungsi.

#### Day 9 — Testing, Deploy & Proposal Final (9 Maret 2026)

| PIC               | Task                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| ML/AI Engineer    | Finalisasi proposal/paper, semua metrik evaluasi.                                               |
| Backend Engineer  | Deploy backend ke Railway/Render, database ke Supabase, uji stabilitas WebSocket di cloud.      |
| Frontend Engineer | Deploy frontend ke Vercel, integration testing end-to-end, performance testing (API < 2 detik). |

**Deliverable:** Aplikasi live di cloud + proposal final v1.0.

#### Day 10 — Demo Video + Submit (10 Maret 2026)

| PIC       | Task                                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Semua** | Record demo video ~10 menit (highlight: RL simulation real-time). GitHub final checklist (README, requirements.txt, .env.example, docs). Persiapan local backup demo. **SUBMIT.** |

**Deliverable:** Aplikasi tersubmit + demo video + dokumentasi lengkap.

### 10.4 Contingency Plan (Jika Mepet)

Jika timeline terancam, berikut prioritas _feature degradation_:

| Prioritas | Modul          | Versi Minimal yang Diterima                        |
| --------- | -------------- | -------------------------------------------------- |
| 🔴 Core   | RL Simulation  | Grid 10×10, tanpa animasi real-time (batch result) |
| 🟡 High   | Green Equity   | Tanpa K-Means clustering, cukup Gini score + map   |
| 🟢 Medium | Flood Scenario | Hapus scenario simulation, cukup base prediction   |
| 🟢 Medium | Export         | Hanya GeoJSON + CSV, tanpa PDF                     |

### 10.5 Milestone Pasca-Submission

| Tanggal             | Milestone                                           |
| ------------------- | --------------------------------------------------- |
| 10 Mar 2026         | Submission selesai                                  |
| 11–21 Mar 2026      | Refinement & polish pasca-submission                |
| 22 Mar 2026         | Technical Meeting — siapkan jawaban teknis mendalam |
| 23 Mar – 4 Apr 2026 | Persiapan pitch deck + rehearsal                    |
| 5 Apr 2026          | **PITCHING DAY**                                    |

---

## 11. TARGET PENGGUNA

### 11.1 Primary Users

| Segmen                        | Kebutuhan                                      | Fitur Relevan                     |
| ----------------------------- | ---------------------------------------------- | --------------------------------- |
| Urban Planner / BAPPEDA       | Analisis berbasis data untuk RTRW dan RTH      | Semua 4 modul, export report      |
| Pembuat Kebijakan (Eksekutif) | Overview kondisi kota dan prioritas intervensi | Dashboard, City Equity Score      |
| Dinas Lingkungan Hidup        | Pemetaan Green Desert dan rencana penghijauan  | Green Equity Index, RL Simulation |

### 11.2 Secondary Users

- Akademisi dan peneliti urban & lingkungan
- Jurnalis dan LSM lingkungan
- Konsultan perencanaan kota

---

## 12. KEUNGGULAN KOMPETITIF

### 12.1 Analisis Kompetitor

| Platform               | Deskripsi                    | Kekurangan vs UrbanInsight AI                                     |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------- |
| Google Earth Engine    | Platform analisis geospasial | Tidak accessible sebagai web platform, tidak ada RL simulation    |
| BNPB inaRISK           | Platform informasi bencana   | Hanya modul banjir, tidak ada ML prediktif, tidak ada rekomendasi |
| Urban Climate Analyzer | Riset akademik               | Tidak dalam bentuk production-ready WebGIS multi-user             |
| TreePlotter (US)       | Aplikasi inventaris pohon    | Hanya inventaris pohon, tidak ada optimasi RL                     |

### 12.2 4 Keunggulan Unik UrbanInsight AI

1. **RL-Powered Prescriptive Simulation** — Satu-satunya di kelasnya yang memberikan rekomendasi tindakan, bukan hanya menampilkan kondisi.
2. **Multi-Objective Optimization** — RL agent mengoptimasi 3 tujuan sekaligus (suhu + banjir + green equity) dengan constraint anggaran.
3. **Grid-Based Urban Simulation** — Kota direpresentasikan sebagai grid spasial 100m, memungkinkan granularitas tinggi.
4. **Real-Time Before vs After Viewer** — Pengguna dapat melihat proyeksi perubahan di peta secara langsung saat simulasi berjalan.

---

## 13. KETERBATASAN & ASUMSI KRITIS

Transparansi terhadap keterbatasan merupakan bagian integral dari rigor ilmiah proyek ini. Berikut keterbatasan yang diakui dan rencana mitigasinya:

| No  | Keterbatasan                                                                                                  | Dampak                                                                                          | Mitigasi / Catatan                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Model LST berbasis data satelit periodik**, bukan real-time. Landsat memiliki revisit cycle 16 hari.        | Prediksi LST merepresentasikan kondisi rata-rata, bukan snapshot per jam.                       | Cukup untuk perencanaan kota (bukan early warning). Roadmap v2 mengintegrasikan sensor IoT untuk real-time.                                            |
| 2   | **RL agent menggunakan simplified transition model**, bukan simulasi biofisik penuh.                          | Dampak penanaman pohon bersifat estimatif, bukan simulasi fisika (evapotranspirasi, wind flow). | Transition model dikalibrasi dari meta-analisis literatur (Bowler et al., 2010). Untuk produksi, dapat ditingkatkan dengan model i-Tree atau ENVI-met. |
| 3   | **Green Equity Index menggunakan proksi spasial** (jarak ke RTH, luas), **bukan survei kepuasan masyarakat.** | Index mungkin tidak sepenuhnya merepresentasikan "equity" yang dirasakan warga.                 | Pendekatan proksi spasial konsisten dengan literatur (Wolch et al., 2014). Roadmap v3 merencanakan citizen science integration.                        |
| 4   | **Training data terbatas pada 1 kota** (Surabaya).                                                            | Model mungkin tidak langsung transferable ke kota lain tanpa re-training.                       | Transfer learning dan fine-tuning direncanakan untuk multi-city support di v2.                                                                         |
| 5   | **Tidak ada ground truth / validasi lapangan.**                                                               | Akurasi model terbatas pada validasi against data satelit itu sendiri.                          | Dimitigasi dengan spatial K-fold CV, temporal validation, dan benchmark terhadap literatur (lihat Section 8.4).                                        |
| 6   | **Grid 100m mungkin terlalu kasar** untuk beberapa analisis (misalnya jalan sempit atau gang).                | Detail intra-grid hilang; satu grid cell mungkin berisi heterogenitas tinggi.                   | Resolusi 100m dipilih sebagai trade-off antara detail dan komputasi. Cukup untuk keputusan level kelurahan/kecamatan.                                  |

---

## 14. RISIKO & MITIGASI

| No  | Risiko                                       | Probabilitas | Dampak        | Strategi Mitigasi                                                              |
| --- | -------------------------------------------- | ------------ | ------------- | ------------------------------------------------------------------------------ |
| 1   | GEE data download lambat                     | Sedang       | Tinggi        | Mulai Day 1 pagi, export ke Google Drive, siapkan backup data lokal            |
| 2   | RL training tidak konvergen                  | Sedang       | Tinggi        | Gunakan simplified 20×20 grid, target 30 menit training, tuning reward scaling |
| 3   | Model ML akurasi di bawah target             | Rendah       | Sedang        | Augment dengan synthetic data, feature engineering tambahan, ensemble methods  |
| 4   | WebSocket tidak stabil di cloud              | Sedang       | Tinggi        | Test di Railway sejak Day 9, siapkan HTTP polling fallback                     |
| 5   | Model .pkl terlalu besar                     | Rendah       | Sedang        | Compress model, simpan di cloud storage, lazy loading                          |
| 6   | Tim kewalahan (scope)                        | Sedang       | Tinggi        | Ikuti contingency plan (Section 10.4), drop fitur non-core, daily standup sync |
| 7   | Hosting crash saat pitching                  | Rendah       | Sangat Tinggi | Siapkan recorded demo video + local demo environment                           |
| 8   | Data satelit tidak tersedia untuk kota pilot | Rendah       | Tinggi        | Siapkan kota backup (Bandung), validasi data Day 1                             |

---

## 15. KEAMANAN & PRIVASI DATA

Meskipun platform ini adalah prototipe demo, standar keamanan dasar tetap diterapkan:

| Aspek                     | Implementasi                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Security**          | API endpoints dilindungi dengan API key. Rate limiting diterapkan (100 req/min per client).                                                    |
| **Database Security**     | Supabase Row Level Security (RLS) aktif. Koneksi database melalui SSL.                                                                         |
| **Data Sensitivity**      | Data populasi yang digunakan adalah data agregat per grid (bukan individu). Tidak ada PII (Personally Identifiable Information) yang disimpan. |
| **Environment Variables** | Semua credentials (DB, API keys, GEE) disimpan di `.env`, tidak di-commit ke repository.                                                       |
| **CORS Policy**           | Backend hanya menerima request dari domain frontend yang terdaftar.                                                                            |

---

## 16. RENCANA MASA DEPAN

### V2.0 — Q3 2026

- **IoT Sensor Integration:** Koneksi ke sensor suhu dan curah hujan real-time untuk model yang lebih akurat
- **Multi-City Support:** Dashboard perbandingan antar kota secara bersamaan
- **Open API:** Endpoint publik untuk integrasi dengan sistem pemerintah

### V3.0 — Q1 2027

- **Mobile Application:** Aplikasi native iOS/Android untuk field inspector dan pemantauan lapangan
- **Citizen Science Integration:** Crowdsourcing data lapangan dari masyarakat

### Jangka Panjang

- **Policy Scenario Builder:** Simulasi dampak kebijakan tata ruang sebelum diimplementasi
- **Carbon Credit Estimation:** Kalkulasi nilai karbon dari rencana penghijauan optimal
- **Advanced Biophysical Models:** Integrasi i-Tree / ENVI-met untuk simulasi yang lebih akurat

---

## 17. KESIMPULAN

UrbanInsight AI merepresentasikan lompatan signifikan dari cara kota-kota Indonesia selama ini merencanakan intervensi lingkungan. Dengan menggabungkan:

- **Data satelit resolusi tinggi** yang diproses via Google Earth Engine
- **Machine learning berbasis XGBoost** untuk prediksi suhu dan risiko banjir
- **Green Equity Index** yang mengukur ketimpangan secara spasial dan kuantitatif
- **Reinforcement Learning (PPO)** yang memberikan rekomendasi optimal berbasis multi-objective

UrbanInsight AI mentransformasi cara perencana kota mengambil keputusan: dari intuisi berbasis pengalaman menjadi **evidence-based prescriptive planning** yang diperkuat AI.

Dalam 10 hari sprint yang terencana dengan ketat, tim 3 orang akan membangun platform ini dari nol hingga siap dipresentasikan — dengan fondasi teknis yang solid, interface yang intuitif, dan fitur simulasi yang belum ada sebelumnya di ekosistem tools perencanaan kota Indonesia.

> _"Don't just see the problem. Solve it."_

---

**Dokumen ini disusun sebagai Rencana Pelaksanaan dan Desain (RPD) v2.0 untuk proyek UrbanInsight AI.**

**Tanggal: 1 Maret 2026 | Revisi: 5 Maret 2026**

_Prepared by: Yudistira Azfa | UrbanInsight AI Team (3 Members)_

---

### Referensi Literatur

1. Bowler, D. E., et al. (2010). Urban greening to cool towns and cities: A systematic review of the empirical evidence. _Landscape and Urban Planning_, 97(3), 147-155.
2. Zölch, T., et al. (2016). Regulating urban surface runoff through nature-based solutions. _Environmental Research_, 151, 283-293.
3. Berland, A., et al. (2017). The role of trees in urban stormwater management. _Landscape and Urban Planning_, 162, 167-177.
4. Weng, Q., et al. (2019). Estimation of land surface temperature from remote sensing. _Remote Sensing of Environment_, 235, 111437.
5. Tehrany, M. S., et al. (2019). Flood susceptibility mapping using machine learning models. _Journal of Hydrology_, 573, 338-348.
6. Wolch, J. R., et al. (2014). Urban green space, public health, and environmental justice. _Landscape and Urban Planning_, 125, 234-244.
7. Rizwan, A. M., et al. (2008). A review on the generation, determination and mitigation of Urban Heat Island. _Journal of Environmental Sciences_, 20(1), 120-128.
8. Oke, T. R. (1982). The energetic basis of the urban heat island. _Quarterly Journal of the Royal Meteorological Society_, 108(455), 1-24.
