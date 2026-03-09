import { ThermometerSnowflake, Waves, Droplets } from "lucide-react";

/**
 * Komponen untuk menampilkan statistik live selama simulasi berjalan.
 * Menampilkan penurunan suhu, mitigasi risiko banjir, dan toggle Before/After.
 *
 * @param {Object} props
 * @param {Object} props.metrics - State metrik dari useSimulation hook
 * @param {boolean} props.showBeforeAfter - State boolean Before/After
 * @param {Function} props.onToggleBeforeAfter - Setter state Before/After
 * @returns {JSX.Element}
 */
export default function SimulationStats({
  metrics,
  showBeforeAfter,
  onToggleBeforeAfter,
}) {
  return (
    <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-semibold text-sm">Real-time Impact</h3>
        <span className="text-[10px] uppercase tracking-widest text-base-500 font-medium">
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Heat Reduction Card */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-base-500 bg-black/20 px-1.5 py-0.5 rounded">
              LST
            </span>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white tracking-tight flex items-baseline gap-1">
              -{metrics.tempReduced.toFixed(2)}
              <span className="text-sm text-base-400">°C</span>
            </p>
            <p className="text-[10px] text-base-500 mt-1 uppercase tracking-wide">
              Heat Reduced
            </p>
          </div>
        </div>

        {/* Flood Mitigation Card */}
        <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <Waves className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-base-500 bg-black/20 px-1.5 py-0.5 rounded">
              Risk
            </span>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white tracking-tight flex items-baseline gap-1">
              -{metrics.floodReduced.toFixed(2)}
              <span className="text-sm text-base-400">%</span>
            </p>
            <p className="text-[10px] text-base-500 mt-1 uppercase tracking-wide">
              Flood Mitigated
            </p>
          </div>
        </div>
      </div>

      {/* Progress / Trees Planted info */}
      <div className="flex items-center gap-3 bg-base-900 border border-white/5 rounded-lg p-3">
        <div className="p-1.5 bg-emerald-500/10 rounded-md">
          <Droplets className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <p className="text-xs text-base-300 font-medium">AI Agent Action</p>
            <p className="text-xs font-mono text-white">
              {metrics.treesPlanted}{" "}
              <span className="text-base-500 text-[10px]">trees</span>
            </p>
          </div>
          {/* Progress bar visual */}
          <div className="h-1 w-full bg-base-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${Math.min((metrics.treesPlanted / 200) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Before / After Toggle Switch */}
      <div className="mt-2 flex items-center justify-between py-2 border-t border-white/5">
        <div>
          <p className="text-sm text-white font-medium">Compare Baseline</p>
          <p className="text-[10px] text-base-500">
            Show projected results vs original.
          </p>
        </div>

        <button
          onClick={onToggleBeforeAfter}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            showBeforeAfter ? "bg-emerald-500" : "bg-base-700"
          }`}
          role="switch"
          aria-checked={showBeforeAfter}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              showBeforeAfter ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
