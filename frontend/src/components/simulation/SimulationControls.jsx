import { useState } from "react";
import { TreePine, CloudRain, Play, Settings2 } from "lucide-react";

/**
 * Komponen untuk mengatur parameter simulasi.
 * Panel ini memberikan UI awal untuk Phase 4 (Reinforcement Learning).
 *
 * @param {Object} props
 * @param {Function} props.onRun - Handler untuk tombol Run
 * @param {Function} props.onStop - Handler untuk tombol Stop
 * @param {boolean} props.isRunning - State status simulasi
 * @returns {JSX.Element} Panel kontrol simulasi
 */
export default function SimulationControls({ onRun, onStop, isRunning }) {
  const [treeBudget, setTreeBudget] = useState(500); // dalam ribuan USD atau jumlah pohon
  const [rainfall, setRainfall] = useState(150); // mm/jam

  return (
    <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-5 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
          <Settings2 className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">
            Simulation Parameters
          </h3>
          <p className="text-base-400 text-xs">Configure AI scenario inputs</p>
        </div>
      </div>

      {/* Sliders Container */}
      <div className="flex flex-col gap-6">
        {/* Tree Planting Budget Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-medium text-base-300">
                Tree Planting Budget
              </label>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              ${treeBudget}k
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={treeBudget}
            onChange={(e) => setTreeBudget(e.target.value)}
            className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-1.5 px-0.5">
            <span className="text-[10px] text-base-500">$0</span>
            <span className="text-[10px] text-base-500">$2M</span>
          </div>
        </div>

        {/* Rainfall Intensity Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <label className="text-xs font-medium text-base-300">
                Rainfall Intensity
              </label>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
              {rainfall} mm/h
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-1.5 px-0.5">
            <span className="text-[10px] text-base-500">Light</span>
            <span className="text-[10px] text-base-500">Extreme</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isRunning ? (
        <button
          onClick={onStop}
          className="w-full mt-6 bg-red-600/10 hover:bg-red-600/20 text-red-500 transition-all duration-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 outline-none border border-red-500/50 hover:border-red-500 group"
        >
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          Stop Simulation
        </button>
      ) : (
        <button
          onClick={() => onRun(treeBudget, rainfall)}
          className="w-full mt-6 bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 outline-none border border-primary-500/50 hover:border-white/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] group"
        >
          <Play className="w-4 h-4 fill-white/80 group-hover:fill-white transition-all" />
          Run RL Simulation
        </button>
      )}
    </div>
  );
}
