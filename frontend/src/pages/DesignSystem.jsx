import { useState, useEffect } from "react";
import { Terminal, Copy, Check, Palette, Map, Type, Box } from "lucide-react";
import {
  BASE_COLORS,
  PRIMARY_COLORS,
  ACCENT_COLORS,
  SEMANTIC_COLORS,
  HEAT_SCALE,
  FLOOD_SCALE,
  EQUITY_CLUSTERS,
  SHADOWS,
  EASINGS,
  TYPOGRAPHY,
  TYPE_SCALE,
} from "@/constants/designTokens";

/* ── Copy helper ── */
function copyHex(text, setCopied) {
  navigator.clipboard.writeText(text);
  setCopied(text);
  setTimeout(() => setCopied(null), 1500);
}

/* ── Section wrapper ── */
function Section({ id, title, description, badge, icon: Icon, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-32 pt-24 pb-12 border-b border-white/[0.05] last:border-0 relative"
    >
      {/* Decorative ambient glow per section */}
      <div className="absolute top-24 -left-32 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-12 max-w-2xl relative z-10">
        {badge && (
          <span className="inline-block px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-xs font-mono text-base-400 mb-4 tracking-wider uppercase">
            {badge}
          </span>
        )}
        <h2 className="text-3xl font-heading font-semibold tracking-tight text-white mb-4 leading-tight flex items-center gap-3">
          {Icon && (
            <Icon
              className="w-8 h-8 text-primary-400 opacity-80"
              strokeWidth={1.5}
            />
          )}
          {title}
        </h2>
        {description && (
          <p className="text-base-400 text-lg leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ── Color Swatch ── */
function Swatch({ hex, token, label, usage, copied, onCopy }) {
  const isActive = copied === hex;
  const isLight = [
    "#ffffff",
    "#f5f5f5",
    "#e5e5e5",
    "#d4d4d4",
    "#a3a3a3",
    "#22d3ee",
    "#06b6d4",
  ].includes(hex);
  const isTrans = hex.startsWith("rgba");
  const borderClass = isTrans
    ? "border-dashed border-white/20"
    : "border-white/[0.08]";

  return (
    <button
      onClick={() => onCopy(hex)}
      className="group flex flex-col w-full text-left transition-all duration-300 outline-none rounded-xl overflow-hidden focus-visible:ring-1 focus-visible:ring-primary-500 hover:-translate-y-1 bg-base-900 border border-white/[0.05] shadow-card hover:shadow-glow-sm relative"
    >
      <div
        className={`relative w-full h-20 flex items-end justify-end p-3 transition-colors ${borderClass} border-b`}
        style={{ backgroundColor: hex }}
      >
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: isLight ? "#000000" : "rgba(255,255,255,0.9)" }}
        >
          {isActive ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-start">
        <p className="font-mono text-[11px] font-semibold text-white mb-1.5 tracking-tight truncate flex items-center justify-between">
          {token || label}
        </p>
        <p className="text-[11px] text-base-400 leading-snug font-body">
          {usage}
        </p>
      </div>
    </button>
  );
}

/* ── Data scale bar ── */
function ScaleBar({ items, title, description }) {
  return (
    <div className="bg-base-900/50 backdrop-blur-sm border border-white/[0.05] shadow-card rounded-2xl p-6 hover:bg-base-900 transition-colors">
      <h3 className="font-heading font-medium text-lg text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-base-400 mb-6">{description}</p>

      {/* Visual Bar */}
      <div className="flex height-8 rounded-md overflow-hidden mb-6 ring-1 ring-inset ring-white/10 shadow-inner">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex-1 flex items-center justify-center py-2"
            style={{ backgroundColor: item.hex }}
            title={`${item.label} (${item.hex})`}
          >
            {/* Hanya show label kalau di desktop, biar nggak terlalu sempit */}
            <span className="hidden md:inline-block font-mono text-[9px] font-bold text-white/90 drop-shadow-md tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div
              className="shrink-0 mt-1 w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-inset ring-black/20"
              style={{ backgroundColor: item.hex }}
            />
            <div>
              <p className="font-mono text-[11px] font-semibold text-base-200">
                {item.label}
              </p>
              <p className="text-[11px] text-base-500 mt-0.5 leading-relaxed font-body">
                {item.usage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shadow/Glow demo card ── */
function ShadowDemo({ token, value, usage }) {
  const isInner = value.includes("inset");
  const isGlow = token.includes("glow");

  return (
    <div
      className={`relative bg-base-900 border ${isInner ? "border-transparent" : "border-white/[0.05]"} rounded-2xl p-8 flex flex-col justify-between overflow-hidden min-h-[200px]`}
      style={{ boxShadow: value }}
    >
      {isGlow && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl rounded-full mix-blend-screen pointer-events-none"
          style={{ backgroundColor: "rgba(99, 102, 241, 0.4)" }}
        />
      )}
      <div className="relative z-10">
        <p className="font-mono text-sm font-semibold text-white">{token}</p>
        <p className="text-sm text-base-400 mt-2 leading-relaxed">{usage}</p>
      </div>
      <div className="relative z-10 mt-8 pt-4 border-t border-white/[0.05]">
        <code className="font-mono text-[10px] text-base-500 leading-relaxed block truncate">
          {value.split(",").map((v, i) => (
            <span key={i} className="block">
              {v.trim()}
            </span>
          ))}
        </code>
      </div>
    </div>
  );
}

/* ── Navigation ── */
const NAV_ITEMS = [
  { id: "base", label: "Colors", icon: Palette },
  { id: "dataviz", label: "Data Viz", icon: Map },
  { id: "typography", label: "Typography", icon: Type },
  { id: "shadows", label: "Depth & Glow", icon: Box },
];

/* =====================================================
   Page
   ===================================================== */

export default function DesignSystem() {
  const [copied, setCopied] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleCopy(hex) {
    copyHex(hex, setCopied);
  }

  return (
    <div className="min-h-screen bg-base-950 text-base-300 font-body selection:bg-primary-500/30 selection:text-white pb-32">
      {/* Background ambient glow setup (mailkit aesthetic) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top right blob */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/5 blur-[120px]" />
        {/* Bottom left blob */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-600/5 blur-[150px]" />
      </div>

      {/* ── Header ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-base-950/80 backdrop-blur-lg border-white/[0.05]" : "bg-transparent border-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold tracking-tight font-heading text-white">
              UrbanInsight AI{" "}
              <span className="text-primary-400 opacity-80 italic font-emphasis text-2xl ml-1 leading-none">
                ui
              </span>
            </h1>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 font-body text-[13px] font-medium px-3 py-2 text-base-400 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors outline-none"
                >
                  <item.icon className="w-4 h-4 opacity-70" strokeWidth={2} />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <a
            href="/"
            className="flex items-center justify-center gap-2 text-[13px] font-medium text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 shadow-sm outline-none ring-primary-500 focus-visible:ring-2"
          >
            <Terminal className="w-4 h-4 opacity-70" />
            Home
          </a>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 flex flex-col">
        {/* Intro Hero */}
        <div className="py-20 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.1] font-heading">
            Pure dark mode, <br />
            design{" "}
            <span className="font-emphasis italic text-primary-400 font-normal">
              re-imagined.
            </span>
          </h1>
          <p className="text-xl leading-relaxed text-base-400 max-w-2xl font-body">
            A premium, ultra-dark design system built for complex geospatial
            platforms. Uses true black backgrounds `#000`, 1px hairline borders,
            and glowing spatial depth instead of drop shadows.
          </p>
        </div>

        {/* Base Colors */}
        <Section
          id="base"
          badge="01 / Foundation"
          title="Base Colors"
          icon={Palette}
          description="We use pure black (#000000) as the foundation, not dark gray. This creates infinite contrast and allows our hairline borders and ambient glows to do the heavy lifting for visual hierarchy."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {BASE_COLORS.map((c) => (
              <Swatch
                key={c.token}
                {...c}
                copied={copied}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </Section>

        {/* Brand & Accent */}
        <Section
          id="brand"
          badge="02 / Brand Elements"
          title="Vibrant Accents"
          icon={Palette}
          description="Against a pure black backdrop, colors need extreme vibrancy to pop. We use a deep but bright indigo for primary actions, and a sharp cyan to highlight critical data."
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-base-900 border border-white/[0.05] shadow-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:translate-x-0" />

              <div className="relative z-10">
                <h3 className="font-heading text-xl font-medium text-white mb-3">
                  Primary — Deep Indigo
                </h3>
                <p className="text-sm text-base-400 mb-8 max-w-md">
                  Used for hover states, buttons, and ambient background glows.
                  It feels high-tech and sophisticated without being entirely
                  "gamer neon" blue.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {PRIMARY_COLORS.map((c) => (
                    <Swatch
                      key={c.token}
                      {...c}
                      copied={copied}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-base-900 border border-white/[0.05] shadow-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 transition-transform duration-700 group-hover:translate-x-0" />

              <div className="relative z-10">
                <h3 className="font-heading text-xl font-medium text-white mb-3">
                  Accent — Cyan
                </h3>
                <p className="text-sm text-base-400 mb-8 max-w-md">
                  Used sharply and sparingly to highlight active mapping layers
                  or critical toolkit selections. Cuts through the indigo
                  beautifully.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {ACCENT_COLORS.map((c) => (
                    <Swatch
                      key={c.token}
                      {...c}
                      copied={copied}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Data Viz */}
        <Section
          id="dataviz"
          badge="03 / Geospatial"
          title="Map Color Scales"
          icon={Map}
          description="Color palettes explicitly engineered for MapLibre GL JS layers. These are highly saturated to ensure the map remains visually distinct from the muted UI chrome."
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScaleBar
              items={HEAT_SCALE}
              title="🌡️ Land Surface Temp"
              description="Sequential: cool (blue) → hot (red). The most intuitive mapping possible."
            />
            <ScaleBar
              items={FLOOD_SCALE}
              title="🌊 Flood Risk"
              description="Sequential: safe (green) → danger (red). Uses a traffic-light mental model."
            />
            <ScaleBar
              items={EQUITY_CLUSTERS}
              title="🌳 Equity Modeling"
              description="Categorical segments for social infrastructure analysis. Colorblind-safe."
            />
          </div>
        </Section>

        {/* Typography */}
        <Section
          id="typography"
          badge="04 / Editorial"
          title="Typography Stack"
          icon={Type}
          description="An elegant pairing of crisp geometric Sans-serif combined with high-contrast Italic Serifs to create a premium, editorial feel amidst data-heavy dashboards."
        >
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.entries(TYPOGRAPHY).map(([key, font]) => (
              <div
                key={key}
                className="bg-base-900 border border-white/[0.05] shadow-card rounded-3xl p-8 flex flex-col h-full hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-grow">
                  <p
                    className={`text-4xl text-white mb-3 ${font.name.includes("Instrument") ? "italic tracking-tight leading-none" : "font-semibold tracking-tight"}`}
                    style={{ fontFamily: font.name.split(" ")[0] }}
                  >
                    {font.name === "Inter (or Satoshi)" ? "Inter" : font.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase text-primary-400 font-semibold tracking-widest mb-4">
                    Weights: {font.weights.join(", ")}
                  </p>
                  <p className="text-sm text-base-400 leading-relaxed">
                    {font.usage}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/[0.05] opacity-60 group-hover:opacity-100 transition-opacity">
                  <p
                    className={`text-xl text-white truncate ${font.name.includes("Instrument") ? "italic" : ""}`}
                    style={{ fontFamily: font.name.split(" ")[0] }}
                  >
                    The quick brown fox
                  </p>
                  {font.name !== "Instrument Serif" && (
                    <p className="text-sm text-base-400 mt-2 tracking-widest font-mono">
                      0123456789
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-transparent border border-white/[0.05] rounded-3xl p-8 lg:p-12 overflow-x-auto">
            <h3 className="font-heading text-lg font-medium text-white mb-2">
              Hierarchy Example
            </h3>
            <p className="text-sm text-base-400 mb-10">
              How heading scales interact with the serif emphasis.
            </p>

            <div className="min-w-[700px] flex flex-col gap-10">
              <div className="pb-8 border-b border-white/[0.05]">
                <p className="font-mono text-[10px] text-base-500 mb-3 uppercase tracking-widest">
                  Display — 64px
                </p>
                <h1 className="text-6xl font-semibold tracking-tight text-white leading-[1.1]">
                  Building cities{" "}
                  <span className="font-emphasis italic font-normal text-primary-400">
                    for the future.
                  </span>
                </h1>
              </div>
              <div className="pb-8 border-b border-white/[0.05]">
                <p className="font-mono text-[10px] text-base-500 mb-3 uppercase tracking-widest">
                  H1 — 48px
                </p>
                <h1 className="text-5xl font-semibold tracking-tight text-white leading-tight">
                  <span className="font-emphasis italic font-normal">
                    Smarter
                  </span>{" "}
                  infrastructure analysis.
                </h1>
              </div>
              <div>
                <p className="font-mono text-[10px] text-base-500 mb-3 uppercase tracking-widest">
                  Body — 16px
                </p>
                <p className="text-base text-base-300 leading-relaxed max-w-2xl">
                  By leveraging real-time satellite imagery and machine learning
                  models, we provide actionable insights for urban planners to
                  simulate the impact of new green spaces before they commit to
                  zoning changes.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Shadows to Glows */}
        <Section
          id="shadows"
          badge="05 / Dimension"
          title="Depth via Glows & Hairlines"
          icon={Box}
          description="In an ultra-dark UI, black drop shadows disappear. We build depth through 1px inner hairlines on surfaces, and ambient radial glows behind interactive elements."
        >
          <div className="grid md:grid-cols-2 gap-8">
            {SHADOWS.map((s) => (
              <ShadowDemo key={s.token} {...s} />
            ))}
          </div>

          <div className="mt-8 bg-base-900 border border-white/[0.05] shadow-card rounded-3xl p-12 text-center relative overflow-hidden group">
            <h4 className="font-heading text-xl font-medium text-white mb-6 relative z-10">
              Button Architecture
            </h4>

            <button className="relative z-10 overflow-hidden group cursor-pointer bg-primary-500 text-white font-medium text-sm px-8 py-3.5 rounded-full shadow-glow-sm hover:shadow-glow-md transition-all duration-300 transform hover:-translate-y-0.5 outline-none ring-2 ring-transparent focus-visible:ring-primary-400">
              <span className="relative z-10 drop-shadow-sm flex items-center gap-2">
                <Map className="w-4 h-4" />
                Analyze Region
              </span>
              {/* Subtle top inner gradient highlight for 3D feel */}
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
            <p className="mt-8 text-sm text-base-400 font-mono">
              Hover over button to see glow & inner light response
            </p>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-20 pt-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 mb-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.05] shadow-card flex items-center justify-center">
            <span className="font-emphasis italic font-normal text-white text-2xl leading-none pt-1">
              U
            </span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest font-bold text-base-500 mb-2">
            UrbanInsight AI
          </p>
          <p className="text-sm text-base-400 max-w-sm">
            Designed for clarity.{" "}
            <span className="font-emphasis italic text-base-300 text-lg">
              Built with restraint.
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
