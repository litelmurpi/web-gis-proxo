

export const BASE_COLORS = [
  { token: "base-950", hex: "#000000", usage: "App background (Pure Black)" },
  {
    token: "base-900",
    hex: "#0a0a0a",
    usage: "Elevated background (Cards/Panels)",
  },
  {
    token: "base-800",
    hex: "#171717",
    usage: "Hover states, secondary panels",
  },
  { token: "base-700", hex: "#262626", usage: "Subtle dividers" },
  { token: "base-600", hex: "#404040", usage: "Hairline borders" },
  { token: "base-500", hex: "#737373", usage: "Muted text, disabled states" },
  { token: "base-400", hex: "#a3a3a3", usage: "Secondary text, descriptions" },
  { token: "base-300", hex: "#d4d4d4", usage: "Sub-headings" },
  { token: "base-200", hex: "#e5e5e5", usage: "Primary body text" },
  { token: "base-100", hex: "#f5f5f5", usage: "Headings, high contrast" },
  { token: "base-50", hex: "#ffffff", usage: "Pure white (Max contrast)" },
];

export const PRIMARY_COLORS = [
  { token: "primary-400", hex: "#7c3aed", usage: "Hover state, light glows" },
  { token: "primary-500", hex: "#6366f1", usage: "Default active / button" },
  { token: "primary-600", hex: "#4f46e5", usage: "Pressed / darker variant" },
];

export const ACCENT_COLORS = [
  {
    token: "accent-400",
    hex: "#22d3ee",
    usage: "Bright highlight / Secondary accents",
  },
  { token: "accent-500", hex: "#06b6d4", usage: "Default accent" },
  { token: "accent-600", hex: "#0891b2", usage: "Muted accent" },
];

export const SEMANTIC_COLORS = [
  { token: "success", hex: "#10b981", usage: "Positive metrics, green areas" },
  { token: "warning", hex: "#f59e0b", usage: "Medium risk, alerts" },
  { token: "danger", hex: "#ef4444", usage: "High risk, errors" },
  { token: "info", hex: "#3b82f6", usage: "Informational, links" },
];

export const HEAT_SCALE = [
  { label: "< 28°C", hex: "#2563eb", usage: "Sejuk — area teduh, dekat air" },
  { label: "28–31°C", hex: "#38bdf8", usage: "Normal — urban dengan vegetasi" },
  { label: "31–34°C", hex: "#fbbf24", usage: "Hangat — kepadatan sedang" },
  {
    label: "34–37°C",
    hex: "#f97316",
    usage: "Panas — industrial, minim pohon",
  },
  { label: "> 38°C", hex: "#dc2626", usage: "Heat island — butuh intervensi" },
];

export const FLOOD_SCALE = [
  { label: "0.0 – 0.3", hex: "#10b981", usage: "Rendah — drainase baik" },
  { label: "0.3 – 0.6", hex: "#fbbf24", usage: "Sedang — perlu monitoring" },
  { label: "0.6 – 0.8", hex: "#f97316", usage: "Tinggi — rawan banjir" },
  { label: "0.8 – 1.0", hex: "#dc2626", usage: "Sangat Tinggi — bahaya" },
];

export const EQUITY_CLUSTERS = [
  {
    label: "Privilege",
    hex: "#8b5cf6",
    usage: "Over-served — prioritas rendah",
  },
  { label: "Balanced", hex: "#3b82f6", usage: "Seimbang — akses RTH merata" },
  { label: "Desert", hex: "#ef4444", usage: "Defisit — butuh RTH segera" },
  { label: "Low Density", hex: "#64748b", usage: "Kepadatan rendah / rural" },
];

export const SHADOWS = [
  {
    token: "shadow-card",
    value: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
    usage: "Inner highlight (edge lighting) untuk card dan panel",
  },
  {
    token: "shadow-glow-sm",
    value: "0 0 20px 0 rgba(99, 102, 241, 0.15)",
    usage: "Primary button hover glow — menggantikan cast shadow hitam",
  },
  {
    token: "shadow-glow-md",
    value: "0 0 40px 0 rgba(99, 102, 241, 0.1)",
    usage: "Active element glow (seperti map layer terpilih)",
  },
  {
    token: "shadow-glow-lg",
    value: "0 0 80px 0 rgba(99, 102, 241, 0.08)",
    usage: "Ambient background blob glow",
  },
];

export const EASINGS = [
  {
    token: "ease-out-expo",
    value: "cubic-bezier(0.16, 1, 0.3, 1)",
    usage: "Page transitions, slide-ins",
  },
  {
    token: "ease-out-back",
    value: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    usage: "Popovers, tooltips (bouncy)",
  },
  {
    token: "ease-in-out",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
    usage: "Generic transitions",
  },
  {
    token: "ease-spring",
    value: "cubic-bezier(0.22, 1, 0.36, 1)",
    usage: "Micro-interactions",
  },
];

export const TYPOGRAPHY = {
  heading: {
    name: "Inter (or Satoshi)",
    weights: [500, 600, 700],
    usage: "Main headings, crisp and modern.",
  },
  emphasis: {
    name: "Instrument Serif",
    weights: ["Italic"],
    usage: "Used inside headings for elegant emphasis (e.g. 'but smarter').",
  },
  body: {
    name: "Inter",
    weights: [400, 500, 600],
    usage: "Body text, UI elements, highly tabular.",
  },
  mono: {
    name: "JetBrains Mono",
    weights: [400, 500],
    usage: "Coordinate data, IDs.",
  },
};

export const TYPE_SCALE = [
  {
    level: "Display",
    size: "64px / 4rem",
    weight: 600,
    lh: "1.1",
    tracking: "-0.04em",
    usage: "Landing hero headline",
  },
  {
    level: "H1",
    size: "48px / 3rem",
    weight: 600,
    lh: "1.2",
    tracking: "-0.03em",
    usage: "Page titles",
  },
  {
    level: "H2",
    size: "32px / 2rem",
    weight: 500,
    lh: "1.3",
    tracking: "-0.02em",
    usage: "Section headers",
  },
  {
    level: "H3",
    size: "24px / 1.5rem",
    weight: 500,
    lh: "1.4",
    tracking: "-0.01em",
    usage: "Card titles",
  },
  {
    level: "Body",
    size: "16px / 1rem",
    weight: 400,
    lh: "1.6",
    tracking: "0",
    usage: "Paragraphs",
  },
  {
    level: "Small",
    size: "14px / 0.875rem",
    weight: 400,
    lh: "1.5",
    tracking: "0",
    usage: "Descriptions",
  },
];
