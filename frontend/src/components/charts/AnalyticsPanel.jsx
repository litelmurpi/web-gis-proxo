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

/**
 * Menghitung rata-rata skor dari seluruh grid GeoJSON untuk setiap metrik risiko.
 * WHY: Kita menghitung agregat dari mockGeoJSON agar data radar chart
 * mencerminkan kondisi keseluruhan kota, bukan per-sel individual.
 *
 * @param {GeoJSON.FeatureCollection} geojson - Data grid kota
 * @returns {Array<{metric: string, value: number, fullMark: number}>} Data siap Recharts
 */
function computeCityMetrics(geojson) {
  const features = geojson?.features || [];
  const count = features.length || 1;

  const totals = features.reduce(
    (acc, f) => {
      const p = f.properties;
      // Use 'lst' (°C, typically 25-35) normalized to 0-100, or heatScore for fallback
      const heatVal = p.lst != null
        ? Math.max(0, Math.min(100, ((p.lst - 24) / 12) * 100)) // 24°C=0, 36°C=100
        : (p.heatScore || 0);
      acc.heat += heatVal;
      acc.flood += (p.floodScore || 0);
      acc.equity += (p.equityScore || 0);
      acc.pop += (p.population || 0);
      return acc;
    },
    { heat: 0, flood: 0, equity: 0, pop: 0 },
  );

  return [
    { metric: "Heat Risk", value: Math.round(totals.heat / count), fullMark: 100 },
    { metric: "Flood Risk", value: Math.round(totals.flood / count), fullMark: 100 },
    { metric: "Green Equity", value: Math.round(totals.equity / count), fullMark: 100 },
    {
      metric: "Population",
      value: Math.round(totals.pop / count / 10), // Normalize to 0-100
      fullMark: 100,
    },
  ];
}

/**
 * Warna stroke Radar Chart berdasarkan layer aktif.
 * WHY: Agar visual chart selalu selaras (color-coded) dengan layer peta yang sedang ditampilkan.
 * @type {Record<string, string>}
 */
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

/**
 * Custom tooltip untuk Radar Chart.
 * Menampilkan nama metrik dan nilainya dengan gaya premium dark mode.
 */
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

/**
 * Panel analitik mengapung di sudut kanan atas peta (Desktop).
 * Berisi Radar Chart yang menggambarkan skor risiko rata-rata seluruh kota.
 * Pada mobile, panel ini bisa di-collapse (lipat) agar tidak menghalangi peta.
/**
 * Panel analitik mengapung di sudut kanan atas peta (Desktop).
 * Berisi Radar Chart yang menggambarkan skor risiko rata-rata seluruh kota.
 * Pada mobile, panel ini beroperasi sebagai Modal yang menutupi layar.
 *
 * @param {boolean} isOpen - State apakah panel terbuka (khusus mobile)
 * @param {Function} onClose - Fungsi menutup panel (khusus mobile)
 * @returns {JSX.Element} Panel analitik atau Modal analitik di mobile
 */
export default function AnalyticsPanel({ isOpen, onClose }) {
  const { activeLayer, cityGeoJSON } = useLayer();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cityMetrics = useMemo(() => computeCityMetrics(cityGeoJSON), [cityGeoJSON]);
  const hasData = cityGeoJSON && cityGeoJSON.features?.length > 0;

  const strokeColor = radarStrokeColors[activeLayer] || "#6366f1";
  const fillColor = radarFillColors[activeLayer] || "rgba(99, 102, 241, 0.15)";

  // Mobile Modal View
  const mobileModal = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-base-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <BarChart3 className="w-4 h-4 text-primary-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              City Analytics
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-base-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Selalu terbuka) */}
        <div className="p-4">
          <ChartContent
            cityMetrics={cityMetrics}
            strokeColor={strokeColor}
            fillColor={fillColor}
          />
        </div>
      </div>
    </div>
  );

  // Desktop Floating Panel View
  const desktopPanel = (
    <div className="hidden lg:block absolute top-4 right-16 z-10 pointer-events-auto">
      <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-72 overflow-hidden">
        {/* Header — selalu terlihat */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors outline-none"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <BarChart3 className="w-4 h-4 text-primary-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              City Analytics
            </span>
          </div>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-base-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-base-400" />
          )}
        </button>

        {/* Body — bisa di-collapse */}
        {!isCollapsed && (
          <div className="p-4">
            <ChartContent
              cityMetrics={cityMetrics}
              strokeColor={strokeColor}
              fillColor={fillColor}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {mobileModal}
      {desktopPanel}
    </>
  );
}

/**
 * Komponen reusable untuk isi Chart agar tidak diulang di Mobile/Desktop
 */
function ChartContent({ cityMetrics, strokeColor, fillColor }) {
  return (
    <>
      {/* Radar Chart */}
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
              dot={{
                r: 3,
                fill: strokeColor,
                strokeWidth: 0,
              }}
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistik Kartu Ringkas */}
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
              {m.value}
              <span className="text-base-500 text-[10px] ml-0.5">/100</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
