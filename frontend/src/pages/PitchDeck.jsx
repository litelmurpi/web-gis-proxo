import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, X, Terminal, Check,
  ThermometerSun, Droplets, TreePine, BrainCircuit,
  Map, Target, Sparkles, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Motion Primitives ─────────────────────────────────────────────────────
const SPRING = [0.16, 1, 0.3, 1]; // ease-out-expo

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  exit:  { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55, ease: SPRING } },
  exit:   { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.25, ease: "easeIn" } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
  show:   { opacity: 1, scale: 1,    filter: "blur(0px)", transition: { duration: 0.5, ease: SPRING } },
  exit:   { opacity: 0, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.2 } },
};

// ─── Reusable Badge ─────────────────────────────────────────────────────────
function SlideBadge({ label }) {
  return (
    <motion.span
      variants={fadeUp}
      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-semibold tracking-[0.18em] uppercase border border-white/10 bg-white/[0.03] text-primary-400 mb-5 select-none"
    >
      {label}
    </motion.span>
  );
}

// ─── Reusable Heading ────────────────────────────────────────────────────────
function SlideTitle({ children, className = "" }) {
  return (
    <motion.h2
      variants={fadeUp}
      className={`text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-white tracking-tight leading-[1.1] mb-3 ${className}`}
    >
      {children}
    </motion.h2>
  );
}

// ─── Reusable Subtitle ────────────────────────────────────────────────────────
function SlideSubtitle({ children }) {
  return (
    <motion.p
      variants={fadeUp}
      className="text-base sm:text-lg text-base-400 font-light leading-relaxed mb-8 max-w-2xl"
    >
      {children}
    </motion.p>
  );
}

// ─── SLIDE DEFINITIONS ────────────────────────────────────────────────────────
const SLIDES = [
  // 0 — TITLE
  {
    id: "title",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
        className="flex flex-col items-center justify-center text-center min-h-[65vh] px-4 gap-8"
      >
        {/* Logo mark */}
        <motion.div variants={fadeIn} className="relative">
          <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-[80px]" />
          <div className="relative w-20 h-20 rounded-3xl bg-base-900 border border-white/10 shadow-card flex items-center justify-center">
            <span className="font-emphasis italic text-white text-4xl leading-none pt-1">U</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp} className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading font-semibold tracking-tighter text-white leading-[1.05]">
            UrbanInsight
            <span className="font-emphasis italic font-normal text-primary-400"> AI</span>
          </h1>
          <div className="absolute -inset-8 bg-primary-500/10 blur-[80px] rounded-full -z-10" />
        </motion.div>

        {/* Tagline */}
        <motion.p variants={fadeUp}
          className="text-base-400 text-base sm:text-xl font-light leading-relaxed max-w-lg"
        >
          From{" "}
          <span className="text-base-500 line-through decoration-base-600">Seeing the Problem</span>
          {" "}to{" "}
          <span className="text-accent-400 font-medium not-italic">Recommending the Solution</span>
        </motion.p>

        {/* Pills */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-sm font-mono text-base-300">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Web Development
          </span>
          <span className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-sm font-mono text-base-500">
            Team Jamsuy
          </span>
        </motion.div>

        {/* Members */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-4">
          {[
            "M. Gassa Sandy Revaldy Aji",
            "Bintang A'araf Stevan Putra",
            "Yudistira Azfa Dani Wibowo",
          ].map((name, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-base-900 border border-white/[0.05] rounded-2xl shadow-card">
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <span className="font-mono text-xs text-primary-400 font-semibold">{i + 1}</span>
              </div>
              <p className="text-sm text-base-300 font-medium leading-tight">{name}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    ),
  },

  // 1 — PROBLEM
  {
    id: "problem",
    badge: "01 / The Crisis",
    title: "3 Interconnected Urban Crises",
    subtitle: "Growing every year in Indonesian cities — and no tool addresses all three together.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6 w-full">

        {/* 3 crisis cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: ThermometerSun,
              color: "#ef4444",
              colorClass: "text-red-400",
              bgClass: "bg-red-500/10",
              borderClass: "border-red-500/20",
              title: "Urban Heat Islands",
              desc: "Cities are 1–7°C hotter than surrounding areas — raising health risks and energy consumption.",
            },
            {
              icon: Droplets,
              color: "#3b82f6",
              colorClass: "text-blue-400",
              bgClass: "bg-blue-500/10",
              borderClass: "border-blue-500/20",
              title: "Recurring Floods",
              desc: "Low drainage + high imperviousness = devastating periodic floods affecting millions.",
            },
            {
              icon: TreePine,
              color: "#10b981",
              colorClass: "text-emerald-400",
              bgClass: "bg-emerald-500/10",
              borderClass: "border-emerald-500/20",
              title: "Green Inequality",
              desc: "Dense, lower-income neighborhoods have the least green space but the greatest need.",
            },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`relative group p-6 bg-base-900 border ${item.borderClass} rounded-3xl shadow-card overflow-hidden flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className={`absolute top-0 right-0 w-28 h-28 ${item.bgClass} blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2`} />
              <div className={`w-12 h-12 rounded-2xl ${item.bgClass} border ${item.borderClass} flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.colorClass}`} />
              </div>
              <h3 className="text-lg font-heading font-semibold text-white leading-tight">{item.title}</h3>
              <p className="text-sm text-base-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* The gap callout */}
        <motion.div variants={fadeUp}
          className="w-full p-5 sm:p-7 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-mono text-primary-400 tracking-widest uppercase mb-1">The Gap</p>
            <p className="text-base text-white leading-relaxed">
              Existing tools (inaRISK, Google Earth Engine) are{" "}
              <span className="font-emphasis italic text-base-400">descriptive</span> — they show what's happening.
              But they never answer:{" "}
              <span className="text-white font-medium">"Where should we act, and which actions deliver the greatest impact?"</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    ),
  },

  // 2 — SOLUTION
  {
    id: "solution",
    badge: "02 / The Platform",
    title: "Prescriptive Analytics for Urban Planning",
    subtitle: "We don't just visualize problems — we recommend optimal solutions.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ThermometerSun,
              title: "Heat Prediction",
              desc: "Computes Land Surface Temp per 100m grid cell via real-time weather + building density.",
              accent: "text-red-400 bg-red-500/10 border-red-500/20",
            },
            {
              icon: Droplets,
              title: "Flood Scoring",
              desc: "Composite flood probability (0–100) based on precipitation, soil moisture & water proximity.",
              accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            },
            {
              icon: Sparkles,
              title: "Green Equity Index",
              desc: "Quantifies access inequality per cell — identifies 'Green Deserts' at ward level.",
              accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              icon: BrainCircuit,
              title: "RL Tree Placement",
              desc: "Greedy RL Agent places trees optimally under budget, balancing 3 objectives simultaneously.",
              accent: "text-primary-400 bg-primary-500/10 border-primary-500/20",
              flagship: true,
            },
          ].map((m, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`relative flex flex-col gap-4 p-6 rounded-3xl border shadow-card transition-all duration-300 hover:-translate-y-1 ${
                m.flagship
                  ? "bg-primary-950/30 border-primary-500/30 shadow-glow-sm"
                  : "bg-base-900 border-white/[0.05]"
              }`}
            >
              {m.flagship && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-[10px] font-mono text-primary-300 tracking-widest uppercase">
                  Flagship
                </div>
              )}
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${m.accent}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-heading font-semibold text-white mb-2 leading-tight">{m.title}</h4>
                <p className="text-sm text-base-400 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
  },

  // 3 — ARCHITECTURE
  {
    id: "architecture",
    badge: "03 / System Design",
    title: "Technical Architecture",
    subtitle: "Modern, real-time web + data pipeline at 100m geospatial resolution.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4 w-full">

        {/* Stack row */}
        <motion.div variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Frontend */}
          <div className="p-6 bg-base-900 border border-white/[0.05] rounded-3xl shadow-card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                <Map className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em]">Frontend</p>
                <h3 className="text-base font-heading font-semibold text-white">React 19 + Vite</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["MapLibre GL JS", "TailwindCSS 4", "Framer Motion", "Recharts", "Axios"].map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-accent-500/10 border border-accent-500/15 text-accent-300 text-[11px] font-mono">{t}</span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="p-6 bg-base-900 border border-primary-500/20 rounded-3xl shadow-glow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em]">Backend</p>
                <h3 className="text-base font-heading font-semibold text-white">FastAPI + Python 3.10</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "grid.py", desc: "Microclimate synthesis" },
                { name: "rl_engine.py", desc: "Greedy RL Agent" },
                { name: "endpoints.py", desc: "REST API" },
                { name: "cache.py", desc: "In-memory TTL" },
              ].map(f => (
                <div key={f.name} className="p-3 bg-base-950 border border-white/[0.05] rounded-xl">
                  <p className="font-mono text-xs text-primary-300 mb-0.5">{f.name}</p>
                  <p className="text-[10px] text-base-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Connector */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-white/5" />
          <ArrowRight className="w-4 h-4 text-base-600 rotate-90" />
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        {/* Data Sources */}
        <motion.div variants={fadeUp}
          className="p-6 bg-base-900 border border-white/[0.05] rounded-3xl shadow-card flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Map className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em] mb-1">External Data Sources</p>
            <p className="font-mono text-sm text-base-300 leading-relaxed">
              Open-Meteo · OSM/Nominatim · WorldPop TIF · GHSL Building TIF · ESA WorldCover TIF
            </p>
          </div>
        </motion.div>
      </motion.div>
    ),
  },

  // 4 — RL ALGORITHM
  {
    id: "rl",
    badge: "04 / The AI Engine",
    title: "Multi-Objective RL Optimization",
    subtitle: "Balancing Heat, Flood, and Equity under realistic budget constraints — simultaneously.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6 w-full">

        {/* Reward formula */}
        <motion.div variants={fadeUp}
          className="relative p-6 sm:p-8 bg-base-900 border border-white/[0.05] rounded-[2rem] shadow-card overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 blur-[80px] rounded-full -z-0" />
          <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.18em] mb-5 relative z-10">Reward Function</p>
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <span className="text-base-500 font-mono text-sm">reward =</span>
            {[
              { val: "0.35", label: "× Heat Δ", bg: "bg-red-500/10 border-red-500/20 text-red-300" },
              { op: "+" },
              { val: "0.30", label: "× Flood Δ", bg: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
              { op: "+" },
              { val: "0.25", label: "× Equity Δ", bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
              { op: "−" },
              { val: "0.10", label: "× Cost", bg: "bg-white/5 border-white/10 text-base-400" },
            ].map((t, i) =>
              t.op
                ? <span key={i} className="text-base-600 font-mono font-bold text-lg">{t.op}</span>
                : (
                  <div key={i} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-mono font-semibold ${t.bg}`}>
                    <span className="opacity-70">{t.val}</span>
                    <span>{t.label}</span>
                  </div>
                )
            )}
          </div>
        </motion.div>

        {/* Per-tree impact */}
        <motion.div variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: ThermometerSun, label: "Heat Effect",   cell: "−0.5 to −1.5°C",  nbr: "−0.05°C on neighbors",  color: "text-red-400 bg-red-500/10 border-red-500/20"     },
            { icon: Droplets,       label: "Flood Effect",  cell: "−3 to −11%",       nbr: "No neighbor effect",    color: "text-blue-400 bg-blue-500/10 border-blue-500/20"   },
            { icon: TreePine,       label: "Equity Effect", cell: "+2 to +8 pts",     nbr: "+0.5 pts on neighbors", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          ].map((e, i) => (
            <div key={i} className="p-5 bg-base-900 border border-white/[0.05] rounded-2xl shadow-card flex gap-4 items-start">
              <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center ${e.color}`}>
                <e.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-heading font-semibold text-white mb-1">{e.label}</p>
                <p className="text-base text-primary-300 font-mono font-semibold">{e.cell}</p>
                <p className="text-xs text-base-500 mt-0.5">{e.nbr}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Key insight */}
        <motion.div variants={fadeUp}
          className="p-5 sm:p-6 bg-primary-950/20 border border-primary-500/20 rounded-2xl flex items-center gap-4"
        >
          <BrainCircuit className="w-8 h-8 text-primary-400 shrink-0" />
          <p className="text-sm text-base-300 leading-relaxed">
            The agent finds a <span className="text-white font-semibold">Pareto-optimal placement</span> — highest collective ecological impact per budget unit, accounting for all three objectives simultaneously.
          </p>
        </motion.div>
      </motion.div>
    ),
  },

  // 5 — FEATURES
  {
    id: "features",
    badge: "05 / Demo Highlights",
    title: "Interactive Platform Features",
    subtitle: "A WebGIS that feels alive — from city search to live RL animation.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
        className="grid sm:grid-cols-2 gap-4 w-full"
      >
        {[
          { title: "Map Explorer", desc: "WebGL grid-based city map. Toggle Heat, Flood, Equity, and Population layers in real-time using MapLibre." },
          { title: "Dynamic City Search", desc: "Geocode any Indonesian city via Nominatim — auto boundary clipping with bounding-box polygon." },
          { title: "RL Simulation", desc: "Set a tree-planting budget and watch the Greedy RL Agent place trees cell-by-cell with live animation." },
          { title: "Compare Baseline", desc: "Instantly toggle between pre- and post-simulation grids. MapLibre re-renders automatically from GeoJSON diffing." },
          { title: "Analytics Dashboard", desc: "City-level KPIs, radar charts, and distribution histograms powered by Recharts." },
          { title: "Fully Responsive", desc: "Optimized for desktop pitching, with a floating-bar mobile UI and hamburger menu on smaller viewports." },
        ].map((f, i) => (
          <motion.div key={i} variants={fadeUp}
            className="group flex gap-4 p-5 bg-base-900 border border-white/[0.05] rounded-2xl shadow-card hover:border-primary-500/30 transition-colors duration-300"
          >
            <div className="w-8 h-8 shrink-0 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Check className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-semibold text-white mb-1">{f.title}</h4>
              <p className="text-sm text-base-400 leading-relaxed font-light">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    ),
  },

  // 6 — UNIQUENESS
  {
    id: "uniqueness",
    badge: "06 / Value Proposition",
    title: "A Genuine Leap Forward",
    subtitle: "From descriptive to prescriptive — no other urban analytics platform in Indonesia combines all of this.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit" className="w-full">
        <div className="w-full rounded-3xl border border-white/[0.07] overflow-hidden bg-base-900 shadow-card">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1.2fr_1fr] bg-base-950 border-b border-white/[0.07] px-4 sm:px-8 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-500 flex items-center">Feature</p>
            <p className="font-heading font-semibold text-base sm:text-lg text-primary-300 flex items-center justify-center text-center">UrbanInsight AI</p>
            <p className="font-heading font-medium text-sm sm:text-base text-base-500 flex items-center justify-center text-center">Existing Tools</p>
          </div>

          {[
            { label: "Core Proposition",  us: "Prescriptive (Recommends)", them: "Descriptive (Visualizes)" },
            { label: "AI Engine",         us: "Reinforcement Learning",    them: "No AI / Manual" },
            { label: "Ecological Scope",  us: "Heat + Flood + Equity",     them: "Single module" },
            { label: "Data Pipeline",     us: "Real-Time APIs",            them: "Static datasets" },
            { label: "Resolution",        us: "100m grid cells",           them: "Ward / city-level" },
          ].map((row, i) => (
            <motion.div key={i} variants={fadeUp}
              className="grid grid-cols-[1fr_1.2fr_1fr] px-4 sm:px-8 py-4 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.015] transition-colors"
            >
              <p className="font-mono text-xs text-base-500 flex items-center">{row.label}</p>
              <div className="flex justify-center">
                <span className="px-3 sm:px-4 py-2 bg-primary-950/30 border border-primary-500/20 rounded-xl text-sm font-medium text-white text-center leading-tight">{row.us}</span>
              </div>
              <p className="text-sm text-base-500 font-light flex items-center justify-center text-center">{row.them}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
  },

  // 7 — IMPACT
  {
    id: "impact",
    badge: "07 / Impact",
    title: "Who Benefits",
    subtitle: "Every tree planted is scientifically optimized for maximum ecological impact.",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
      >
        {[
          { tag: "BAPPEDA",    title: "Urban Planners",     desc: "Data-driven spatial planning — allocate greening budgets precisely where they matter most." },
          { tag: "DLH",        title: "Env. Agencies",      desc: "Identify Green Deserts and prioritize rapid green infrastructure interventions." },
          { tag: "Government", title: "Policy Makers",      desc: "Real-time city condition dashboards for evidence-based rapid public decisions." },
          { tag: "Academia",   title: "Researchers",        desc: "Access to reproducible 100m resolution geospatial datasets and validated climate models." },
          { tag: "Citizens",   title: "Communities",        desc: "Reduced UHI and flood impacts in densely populated, historically under-served neighborhoods." },
          { tag: "NGOs",       title: "Advocates",          desc: "Transparent data tools for environmental policy advocacy and public awareness campaigns." },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp}
            className="group relative p-5 bg-base-900 border border-white/[0.05] rounded-2xl shadow-card hover:border-white/15 transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="inline-block px-2 py-0.5 bg-white/[0.04] border border-white/10 rounded-md text-[9px] font-mono text-base-500 uppercase tracking-[0.15em] mb-3">{item.tag}</span>
            <h4 className="text-base font-heading font-semibold text-white mb-2">{item.title}</h4>
            <p className="text-sm text-base-400 leading-relaxed font-light">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    ),
  },

  // 8 — CLOSING
  {
    id: "closing",
    render: () => (
      <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
        className="flex flex-col items-center justify-center text-center min-h-[65vh] px-4 gap-10"
      >
        {/* Icon */}
        <motion.div variants={fadeIn} className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-[60px] rounded-full" />
          <div className="relative w-16 h-16 rounded-2xl bg-base-900 border border-white/10 shadow-card flex items-center justify-center">
            <span className="font-emphasis italic text-white text-3xl leading-none pt-1">U</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp}>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-heading font-semibold text-white leading-[1.1] tracking-tighter mb-4">
            From Seeing <br />
            <span className="font-emphasis italic font-normal text-primary-400">to Solving.</span>
          </h2>
          <p className="text-lg sm:text-xl text-base-400 font-light max-w-lg leading-relaxed mx-auto">
            "Which actions deliver the greatest impact?"<br />
            <span className="text-white font-medium">UrbanInsight AI answers this.</span>
          </p>
        </motion.div>

        {/* CTA bar */}
        <motion.div variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-8 border-t border-white/[0.07] w-full max-w-md justify-center"
        >
          <div className="text-center">
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em] mb-1">Team</p>
            <p className="text-lg text-white font-heading font-semibold">Jamsuy</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/[0.07]" />
          <div className="text-center">
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em] mb-1">GitHub</p>
            <p className="text-base text-primary-300 font-mono">/litelmurpi/web-gis-proxo</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/[0.07]" />
          <div className="text-center">
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-[0.15em] mb-1">Date</p>
            <p className="text-base text-white font-mono font-medium">Apr 12, 2026</p>
          </div>
        </motion.div>
      </motion.div>
    ),
  },
];

// ─── LABELS (for slides with header) ─────────────────────────────────────────
const HEADERS = {
  problem:      { badge: "01 / The Crisis",        title: "3 Interconnected Urban Crises",        subtitle: "Growing every year in Indonesian cities — and no tool addresses all three together." },
  solution:     { badge: "02 / The Platform",      title: "Prescriptive Analytics for Urban Planning", subtitle: "We don't just visualize problems — we recommend optimal solutions." },
  architecture: { badge: "03 / System Design",     title: "Technical Architecture",               subtitle: "Modern, real-time web + data pipeline at 100m geospatial resolution." },
  rl:           { badge: "04 / The AI Engine",     title: "Multi-Objective RL Optimization",      subtitle: "Balancing Heat, Flood, and Equity under realistic budget constraints — simultaneously." },
  features:     { badge: "05 / Demo Highlights",   title: "Interactive Platform Features",        subtitle: "A WebGIS that feels alive — from city search to live RL animation." },
  uniqueness:   { badge: "06 / Value Proposition", title: "A Genuine Leap Forward",               subtitle: "From descriptive to prescriptive — no other platform in Indonesia combines all of this." },
  impact:       { badge: "07 / Impact",            title: "Who Benefits",                         subtitle: "Every tree planted is scientifically optimized for maximum ecological impact." },
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)),                 []);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", " ", "Enter"].includes(e.key)) { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft")                    { e.preventDefault(); prev(); }
      else if (e.key === "Escape")                       navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, navigate]);

  const slide  = SLIDES[current];
  const header = HEADERS[slide.id];
  const progress = ((current + 1) / SLIDES.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-base-950 text-base-300 font-body flex flex-col overflow-hidden select-none">
      {/* --- Background ------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(to right,#fff1 1px,transparent 1px),linear-gradient(to bottom,#fff1 1px,transparent 1px)", backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)" }}
        />
        {/* Animated ambient glow */}
        <motion.div
          animate={{
            x:    current % 2 === 0 ? "-15%" : "55%",
            y:    current % 3 === 0 ? "-20%" : "10%",
            backgroundColor: current % 2 === 0 ? "rgba(99,102,241,0.07)" : "rgba(6,182,212,0.05)",
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute w-[80vw] h-[80vh] rounded-full blur-[160px] -z-0"
        />
      </div>

      {/* --- Progress bar ----------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04] z-40">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-primary-500 relative"
          style={{ boxShadow: "0 0 10px rgba(99,102,241,0.6)" }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-glow-sm" />
        </motion.div>
      </div>

      {/* --- Header ----------------------------------------------------------- */}
      <header className="relative z-30 flex justify-between items-center px-4 sm:px-8 py-5 shrink-0">
        {/* Left: exit + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            aria-label="Exit Presentation"
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-base-500 hover:text-white hover:bg-white/[0.07] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex h-5 w-px bg-white/[0.07]" />
          <span className="hidden sm:block font-heading font-medium text-sm text-white/40">
            UrbanInsight <span className="italic font-emphasis text-primary-400/70">AI</span>
          </span>
        </div>

        {/* Right: counter + nav buttons */}
        <div className="flex items-center gap-2 bg-base-900 border border-white/[0.06] p-1.5 rounded-full shadow-card">
          <span className="font-mono text-[11px] text-base-500 pl-3 tabular-nums">
            {String(current + 1).padStart(2, "0")}
            <span className="text-base-700 mx-1">/</span>
            {String(SLIDES.length).padStart(2, "0")}
          </span>
          <button
            onClick={prev}
            disabled={current === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-20 hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-20 bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* --- Main content ----------------------------------------------------- */}
      <main className="relative z-20 flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center px-4 sm:px-8 md:px-12 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
            exit={{    opacity: 0, y: -16, scale: 1.01, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: SPRING }}
            className="w-full max-w-5xl flex flex-col items-center"
          >
            {/* Slide header section (badge / title / subtitle) */}
            {header && (
              <div className="w-full text-center mb-8 mt-4">
                <SlideBadge label={header.badge} />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-white tracking-tight leading-[1.1] mb-3">
                  {header.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-base-400 font-light leading-relaxed max-w-2xl mx-auto">
                  {header.subtitle}
                </p>
              </div>
            )}

            {/* Slide body */}
            <div className="w-full">{slide.render()}</div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- Dot nav + keyboard hint ----------------------------------------- */}
      <footer className="relative z-30 flex flex-col items-center gap-3 pb-6 shrink-0">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 h-1.5 bg-primary-400"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        {/* Keyboard hint */}
        <div className="hidden sm:flex items-center gap-2 opacity-25 pointer-events-none">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono font-bold border border-white/10 text-white">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono font-bold border border-white/10 text-white">→</kbd>
          <span className="text-[9px] font-mono uppercase tracking-widest">Navigate</span>
        </div>
      </footer>
    </div>
  );
}
