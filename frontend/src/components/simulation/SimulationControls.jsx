import { useState } from "react";
import {
  TreePine,
  CloudRain,
  Play,
  Settings2,
  MapPin,
  ChevronDown,
  Flame,
  Waves,
  Leaf,
  BadgeDollarSign,
} from "lucide-react";

export default function SimulationControls({
  onRun,
  onStop,
  isRunning,
  isLoading,
}) {
  const [city, setCity] = useState("Surabaya");
  const [treeBudget, setTreeBudget] = useState(50);
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState({
    heat: 0.35,
    flood: 0.3,
    equity: 0.25,
    cost: 0.1,
  });

  const updateWeight = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const disabled = isRunning || isLoading;

  return (
    <div className="bg-base-950/85 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-5 pointer-events-auto">
      
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

      
      <div className="flex flex-col gap-5">
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary-400" />
            <label className="text-xs font-medium text-base-300">
              Target City
            </label>
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Surabaya, Bandung, Jakarta..."
            className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-base-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all disabled:opacity-50"
          />
        </div>

        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-medium text-base-300">
                Tree Budget
              </label>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              {treeBudget} trees
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={treeBudget}
            onChange={(e) => setTreeBudget(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
          />
          <div className="flex justify-between mt-1.5 px-0.5">
            <span className="text-[10px] text-base-500">10</span>
            <span className="text-[10px] text-base-500">500</span>
          </div>
        </div>

        
        <div>
          <button
            onClick={() => setShowWeights(!showWeights)}
            className="flex items-center justify-between w-full text-xs font-medium text-base-400 hover:text-base-200 transition-colors"
          >
            <span>Reward Weights (Advanced)</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showWeights ? "rotate-180" : ""}`}
            />
          </button>

          {showWeights && (
            <div className="mt-3 flex flex-col gap-3 pl-1 border-l-2 border-white/5 ml-1">
              {[
                {
                  key: "heat",
                  label: "Heat Reduction",
                  icon: Flame,
                  color: "text-red-400",
                  bgColor: "bg-red-400/10",
                  borderColor: "border-red-400/20",
                },
                {
                  key: "flood",
                  label: "Flood Mitigation",
                  icon: Waves,
                  color: "text-blue-400",
                  bgColor: "bg-blue-400/10",
                  borderColor: "border-blue-400/20",
                },
                {
                  key: "equity",
                  label: "Green Equity",
                  icon: Leaf,
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-400/10",
                  borderColor: "border-emerald-400/20",
                },
                {
                  key: "cost",
                  label: "Cost Penalty",
                  icon: BadgeDollarSign,
                  color: "text-yellow-400",
                  bgColor: "bg-yellow-400/10",
                  borderColor: "border-yellow-400/20",
                },
              ].map(({ key, label, icon: Icon, color, bgColor, borderColor }) => (
                <div key={key} className="pl-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3 h-3 ${color}`} />
                      <span className="text-[11px] text-base-400">{label}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${color} ${bgColor} px-1.5 py-0.5 rounded border ${borderColor}`}
                    >
                      {weights[key].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[key]}
                    onChange={(e) => updateWeight(key, e.target.value)}
                    disabled={disabled}
                    className="w-full h-1 bg-base-800 rounded-lg appearance-none cursor-pointer accent-base-500 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
      {isLoading ? (
        <button
          disabled
          className="w-full mt-6 bg-primary-600/50 text-white/60 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-primary-500/30 cursor-not-allowed"
        >
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              className="opacity-75"
            />
          </svg>
          Computing Optimal Placement...
        </button>
      ) : isRunning ? (
        <button
          onClick={onStop}
          className="w-full mt-6 bg-red-600/10 hover:bg-red-600/20 text-red-500 transition-all duration-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 outline-none border border-red-500/50 hover:border-red-500 group"
        >
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          Stop Simulation
        </button>
      ) : (
        <button
          onClick={() => onRun(city, treeBudget, weights)}
          className="w-full mt-6 bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 outline-none border border-primary-500/50 hover:border-white/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] group"
        >
          <Play className="w-4 h-4 fill-white/80 group-hover:fill-white transition-all" />
          Run RL Simulation
        </button>
      )}
    </div>
  );
}
