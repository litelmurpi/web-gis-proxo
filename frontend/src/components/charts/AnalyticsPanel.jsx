import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLayer } from "../../context/LayerContext";
import { BarChart3, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function computeCityMetrics(geojson) {
  const features = geojson?.features || [];
  const count = features.length || 1;

  const totals = features.reduce(
    (acc, f) => {
      const p = f.properties;
      const heatVal = p.lst != null
        ? Math.max(0, Math.min(100, ((p.lst - 26) / 10) * 100))
        : (p.heatScore || 0);
      acc.heat += heatVal;
      acc.flood += (p.floodScore || 0);
      acc.equity += (p.equityScore || 0);
      acc.totalPop += (p.population || 0);
      acc.popDensity += Math.min(100, ((p.population || 0) / 3500) * 100);
      return acc;
    },
    { heat: 0, flood: 0, equity: 0, totalPop: 0, popDensity: 0 },
  );

  return [
    { metric: "Heat Risk",    value: Math.round(totals.heat / count),      fullMark: 100, display: null },
    { metric: "Flood Risk",   value: Math.round(totals.flood / count),     fullMark: 100, display: null },
    { metric: "Green Equity", value: Math.round(totals.equity / count),    fullMark: 100, display: null },
    {
      metric: "Population",
      value: Math.round(totals.popDensity / count),
      fullMark: 100,
      display: totals.totalPop.toLocaleString(),
      displayUnit: "residents",
    },
  ];
}

const radarStrokeColors = {
  heat: "#ef4444",
  flood: "#3b82f6",
  equity: "#10b981",
  population: "#eab308",
};

const radarFillColors = {
  heat: "rgba(239, 68, 68, 0.15)",
  flood: "rgba(59, 130, 246, 0.15)",
  equity: "rgba(16, 185, 129, 0.15)",
  population: "rgba(234, 179, 8, 0.15)",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-base-950/95 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-base-300 font-medium">{data.metric}</p>
      <p className="text-sm text-white font-semibold">{data.value}/100</p>
    </div>
  );
}

const panelVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function AnalyticsPanel({ isOpen, onClose }) {
  const { activeLayer, cityGeoJSON } = useLayer();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cityMetrics = useMemo(() => computeCityMetrics(cityGeoJSON), [cityGeoJSON]);
  const hasData = cityGeoJSON && cityGeoJSON.features?.length > 0;

  const strokeColor = radarStrokeColors[activeLayer] || "#6366f1";
  const fillColor = radarFillColors[activeLayer] || "rgba(99, 102, 241, 0.15)";

  const mobileModal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            key="mobile-panel"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-base-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-sm font-semibold text-white">City Analytics</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-base-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <ChartContent
                cityMetrics={cityMetrics}
                strokeColor={strokeColor}
                fillColor={fillColor}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const desktopPanel = (
    <AnimatePresence>
      <motion.div
        key="desktop-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute top-4 right-16 z-10 pointer-events-auto"
      >
        <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-72 overflow-hidden">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors outline-none"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <BarChart3 className="w-4 h-4 text-primary-400" />
              </div>
              <span className="text-sm font-semibold text-white">City Analytics</span>
            </div>
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-base-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-base-400" />
            )}
          </button>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                key="chart-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <ChartContent
                    cityMetrics={cityMetrics}
                    strokeColor={strokeColor}
                    fillColor={fillColor}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      {mobileModal}
      {desktopPanel}
    </>
  );
}

function ChartContent({ cityMetrics, strokeColor, fillColor }) {
  return (
    <>
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={cityMetrics}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={strokeColor}
              fill={fillColor}
              strokeWidth={2}
              dot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {cityMetrics.map((m) => (
          <div
            key={m.metric}
            className="bg-white/3 border border-white/5 rounded-xl px-3 py-2"
          >
            <p className="text-[10px] text-base-500 uppercase tracking-wider">
              {m.metric}
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {m.display ?? m.value}
              <span className="text-base-500 text-[10px] ml-0.5">
                {m.displayUnit ?? "/100"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
