// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ThermometerSun,
  Waves,
  TreePine,
  BrainCircuit,
  Map,
  Layers,
  ArrowRight,
  Globe,
  Github,
  ExternalLink,
  Database,
  Cpu,
  Monitor,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/common/Card";
import Button from "../components/common/Button";
import Threads from "../components/common/Threads";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

/* ─── Data ─── */
const modules = [
  {
    icon: ThermometerSun,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "Urban Heat Prediction",
    desc: "Computes Land Surface Temperature (LST) per grid cell using physics-based formula: Open-Meteo base temp + building density (GHSL) × 6°C − green density (ESA WorldCover) × 4°C.",
    metric: "Real-time LST per Cell",
  },
  {
    icon: Waves,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Flood Risk Scoring",
    desc: "Computes flood risk score (10–95) via composite scoring: building density × 30 + water proximity × 40 + daily precipitation + soil moisture from Open-Meteo.",
    metric: "Composite Score 10–95",
  },
  {
    icon: TreePine,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Green Equity Index",
    desc: "Measures green space access inequality per grid cell: green density (ESA WorldCover) × 100 + open space bonus. Dense built-up areas with no vegetation receive low scores.",
    metric: "Equity Score 5–95",
  },
  {
    icon: BrainCircuit,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "RL Tree Placement",
    desc: "Greedy RL Agent recommends optimal tree planting locations with multi-objective reward: heat reduction (−0.5–1.5°C), flood mitigation (3–11%), and equity improvement (+2–8 pts) per tree.",
    metric: "Multi-Objective Greedy Agent",
  },
];

const techStack = [
  {
    category: "Frontend",
    icon: Monitor,
    items: [
      "React 19 + Vite",
      "MapLibre GL JS",
      "Vanilla CSS (Design System)",
      "Framer Motion",
      "Lucide React Icons",
    ],
  },
  {
    category: "Backend & AI",
    icon: Cpu,
    items: [
      "FastAPI (Python 3.10)",
      "GeoPandas + Shapely",
      "Greedy RL Agent (Custom)",
      "NumPy Vectorized Compute",
      "Rasterio (TIF Sampling)",
    ],
  },
  {
    category: "Data & Infra",
    icon: Database,
    items: [
      "Open-Meteo (Weather API)",
      "WorldPop (Population TIF)",
      "GHSL (Building Density TIF)",
      "ESA WorldCover (Land Use)",
      "OpenStreetMap / Nominatim",
    ],
  },
];

const team = [
  {
    name: "AI / Simulation Engineer",
    role: "RL Engine & Formulas",
    desc: "Greedy RL Agent, multi-objective reward function, transition model, microclimate synthesis",
  },
  {
    name: "Backend/Geospatial Engineer",
    role: "API & Data Pipeline",
    desc: "FastAPI, GeoPandas, raster TIF sampling, Open-Meteo & OSM integration",
  },
  {
    name: "Frontend/UI Engineer",
    role: "WebGIS Interface",
    desc: "React, MapLibre GL, custom design system, data-driven map styling",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-base-950 text-white overflow-hidden selection:bg-primary-500/30">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6">
        {/* Background ambient */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Threads
            amplitude={0.9}
            speed={0.3}
            threadCount={20}
            color="99,102,241"
            className=""
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-[120px]" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center space-y-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-primary-400"
          >
            <Globe className="w-3.5 h-3.5" />
            About the Project
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight"
          >
            UrbanInsight{" "}
            <span className="font-heading italic font-normal text-primary-400">
              AI
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-base-400 max-w-2xl mx-auto leading-relaxed"
          >
            An AI-powered WebGIS platform for sustainable urban planning.
            We don't just visualize the problem — we recommend optimal
            solutions.
          </motion.p>

          <motion.p
            variants={fadeIn}
            className="text-base-500 text-sm italic max-w-xl mx-auto"
          >
            &quot;Don&apos;t just see the problem. Solve it.&quot;
          </motion.p>
        </motion.div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section className="py-20 px-6 border-y border-white/5 bg-base-900/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="space-y-5">
              <h2 className="text-3xl font-semibold">
                Why{" "}
                <span className="text-primary-400 font-heading italic font-normal">
                  prescriptive?
                </span>
              </h2>
              <p className="text-base-400 leading-relaxed">
                Major Indonesian cities face serious ecosystem pressures:
                Urban Heat Islands, periodic flood risk, and unequal access
                to green open spaces.
              </p>
              <p className="text-base-400 leading-relaxed">
                Existing tools are{" "}
                <strong className="text-white">descriptive</strong> or{" "}
                <strong className="text-white">predictive</strong> — they show
                the problem, but fail to answer the most important question:
              </p>
              <blockquote className="border-l-2 border-primary-500 pl-4 py-2 text-white font-medium italic">
                &quot;Where should we act, and what action delivers the
                greatest impact?&quot;
              </blockquote>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        label: "Urban Heat Island",
                        detail: "Temperatures 1–7°C higher in urban areas",
                        color: "bg-red-500",
                      },
                      {
                        label: "Periodic Flood Risk",
                        detail: "Poor drainage + extreme rainfall",
                        color: "bg-blue-500",
                      },
                      {
                        label: "Green Space Inequality",
                        detail: 'Dense neighborhoods = "Green Desert"',
                        color: "bg-emerald-500",
                      },
                      {
                        label: "Non-Proactive Tools",
                        detail: "Intuition-based decisions, not data-driven",
                        color: "bg-amber-500",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${item.color} mt-1.5 shrink-0`}
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {item.label}
                          </p>
                          <p className="text-base-500 text-xs">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4 AI MODULES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-semibold">
              Four{" "}
              <span className="text-primary-400 font-heading italic font-normal">
                AI Modules
              </span>
            </h2>
            <p className="text-base-400 max-w-xl mx-auto text-sm">
              Each module is designed to address one dimension of urban
              challenges, then integrated through the RL agent.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {modules.map((mod) => (
              <motion.div key={mod.title} variants={fadeIn}>
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl border ${mod.bg} shrink-0`}
                      >
                        <mod.icon className={`w-6 h-6 ${mod.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">
                          {mod.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {mod.desc}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="mt-auto pt-3 border-t border-white/5">
                      <span className="text-xs font-mono text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                        {mod.metric}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PILOT CITY ── */}
      <section className="py-20 px-6 border-y border-white/5 bg-base-900/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="text-center space-y-3">
              <h2 className="text-3xl font-semibold">
                Pilot{" "}
                <span className="text-primary-400 font-heading italic font-normal">
                  City
                </span>
              </h2>
              <p className="text-base-400 max-w-xl mx-auto text-sm">
                The platform supports dynamic city search via Nominatim
                Geocoder. Surabaya is the default city with the most complete
                raster TIF data coverage.
              </p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Default City", value: "Surabaya" },
                      { label: "Grid Resolution", value: "300–500m" },
                      { label: "Weather Data", value: "Open-Meteo" },
                      { label: "Population", value: "WorldPop TIF" },
                      { label: "Land Cover", value: "ESA WorldCover" },
                      { label: "Multi-City", value: "Dynamic" },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3">
                        <p className="text-2xl font-semibold text-white mb-1">
                          {item.value}
                        </p>
                        <p className="text-base-500 text-xs uppercase tracking-wider">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-semibold">
              Tech{" "}
              <span className="text-primary-400 font-heading italic font-normal">
                Stack
              </span>
            </h2>
            <p className="text-base-400 max-w-xl mx-auto text-sm">
              A modern full-stack architecture designed for performance,
              scalability, and premium user experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {techStack.map((stack) => (
              <motion.div key={stack.category} variants={fadeIn}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <stack.icon className="w-4 h-4 text-base-300" />
                      </div>
                      <CardTitle>{stack.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {stack.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-base-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500/60 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-6 border-y border-white/5 bg-base-900/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-semibold">
              Development{" "}
              <span className="text-primary-400 font-heading italic font-normal">
                Team
              </span>
            </h2>
            <p className="text-base-400 max-w-xl mx-auto text-sm">
              A small team with big focus — 3 engineers across multiple disciplines.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={fadeIn}>
                <Card className="h-full text-center">
                  <CardContent className="flex flex-col items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/10 flex items-center justify-center">
                      <Layers className="w-7 h-7 text-primary-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base mb-0.5">
                        {member.name}
                      </CardTitle>
                      <p className="text-primary-400 text-xs font-medium mb-2">
                        {member.role}
                      </p>
                      <CardDescription className="text-sm">
                        {member.desc}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary-900/10 mask-[radial-gradient(ellipse_at_top,#000_10%,transparent_70%)]" />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-4xl md:text-5xl font-semibold">
            See it in{" "}
            <span className="text-primary-400 italic font-heading font-normal">
              action.
            </span>
          </h2>
          <p className="text-base-400 text-lg">
            Explore interactive maps, run AI simulations, and see how
            data drives real decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/map">
              <Button size="lg" variant="primary" leftIcon={Map}>
                Open Map Explorer
              </Button>
            </Link>
            <Link to="/simulation">
              <Button size="lg" variant="ghost" rightIcon={ArrowRight}>
                Try RL Simulation
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-base-500 text-sm">
            <a
              href="https://github.com/litelmurpi/web-gis-proxo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
