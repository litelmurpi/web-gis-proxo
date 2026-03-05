import { useLayer } from "../../context/LayerContext";

/**
 * Konfigurasi legenda untuk setiap layer peta.
 * Berisi label, unit, deskripsi, dan warna gradien interpolasi
 * yang sesuai dengan aturan getLayerColorRule() di MapContainer.
 *
 * @type {Record<string, {label: string, unit: string, description: string, min: string, max: string, colors: string[]}>}
 */
const legendConfig = {
  heat: {
    label: "Heat Risk",
    unit: "°C",
    description: "Land Surface Temperature",
    min: "20",
    max: "45",
    // WHY: Gradien warna mengikuti skala interpolasi MapLibre di getLayerColorRule()
    // agar legenda selalu konsisten secara visual dengan rendering peta.
    colors: [
      "rgba(99, 102, 241, 0.6)",
      "rgba(234, 179, 8, 0.7)",
      "rgba(239, 68, 68, 0.85)",
    ],
  },
  flood: {
    label: "Flood Risk",
    unit: "%",
    description: "Predicted Flood Probability",
    min: "0",
    max: "100",
    colors: [
      "rgba(99, 102, 241, 0.6)",
      "rgba(59, 130, 246, 0.7)",
      "rgba(30, 58, 138, 0.85)",
    ],
  },
  equity: {
    label: "Green Equity",
    unit: "idx",
    description: "Green Space Access Index",
    min: "0",
    max: "100",
    colors: [
      "rgba(99, 102, 241, 0.6)",
      "rgba(16, 185, 129, 0.7)",
      "rgba(6, 78, 59, 0.85)",
    ],
  },
  population: {
    label: "Population",
    unit: "K",
    description: "Estimated Population Density",
    min: "0",
    max: "50",
    colors: [
      "rgba(99, 102, 241, 0.6)",
      "rgba(234, 179, 8, 0.7)",
      "rgba(161, 98, 7, 0.85)",
    ],
  },
};

/**
 * Komponen legenda peta yang mengapung di sudut kanan bawah.
 * Secara otomatis berubah berdasarkan layer aktif dari LayerContext.
 *
 * @returns {JSX.Element} Panel legenda dengan gradien warna dan label skala
 */
export default function MapLegend() {
  const { activeLayer } = useLayer();
  const config = legendConfig[activeLayer];

  if (!config) return null;

  const gradientStyle = {
    background: `linear-gradient(to right, ${config.colors.join(", ")})`,
  };

  return (
    <div className="absolute bottom-[120px] left-4 lg:bottom-6 lg:left-4 z-10 pointer-events-auto">
      <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl p-4 w-56 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            {config.label}
          </span>
          <span className="text-[10px] text-base-400 font-mono">
            {config.unit}
          </span>
        </div>

        {/* Deskripsi */}
        <p className="text-[11px] text-base-500 mb-3 leading-relaxed">
          {config.description}
        </p>

        {/* Gradient Bar */}
        <div
          className="h-2.5 rounded-full border border-white/10"
          style={gradientStyle}
        />

        {/* Min / Max Labels */}
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-base-400 font-mono">
            {config.min}
          </span>
          <span className="text-[10px] text-base-400 font-mono">
            {config.max}
          </span>
        </div>
      </div>
    </div>
  );
}
