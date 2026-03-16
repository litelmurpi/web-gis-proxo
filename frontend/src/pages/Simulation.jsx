import { useState } from "react";
import MapContainer from "../components/map/MapContainer";
import SimulationControls from "../components/simulation/SimulationControls";
import SimulationStats from "../components/simulation/SimulationStats";
import { useLayer } from "../context/LayerContext";
import { useSimulation } from "../hooks/useSimulation";
import { Activity, AlertTriangle } from "lucide-react";

export default function Simulation() {
  const { activeLayer } = useLayer();
  const {
    status,
    trees,
    gridAfter,
    metrics,
    error,
    startSimulation,
    stopSimulation,
    resetSimulation,
  } = useSimulation();
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(50);
  const [cityQuery, setCityQuery] = useState("Surabaya"); // Default city for grid loading

  const handleRun = (city, budget, weights) => {
    setCityQuery(city); // Update grid if city changed
    setCurrentBudget(budget);
    setShowBeforeAfter(false);
    startSimulation(city, budget, weights);
  };

  const isLoading = status === "loading";
  const isRunning = status === "animating";

  return (
    <div className="h-full w-full bg-base-950 flex flex-col lg:flex-row overflow-hidden relative">
      {/* LEFT: Map area */}
      <div className="flex-1 relative z-0 h-[60vh] lg:h-full">
        <MapContainer
          activeLayer={activeLayer}
          simulationTrees={trees}
          showBeforeAfter={showBeforeAfter}
          gridAfter={gridAfter}
          cityQuery={cityQuery} // Pass cityQuery to trigger base grid fetch
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-base-950/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-base-950/90 border border-white/10 px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-8 w-8 text-primary-400"
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
              <div className="text-center">
                <p className="text-white font-semibold text-sm">
                  Computing Optimal Placement
                </p>
                <p className="text-base-400 text-xs mt-1">
                  Fetching data & running RL agent...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Running Indicator */}
        {isRunning && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-base-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-white tracking-wide">
              AI Agent Planting... {metrics.treesPlanted}/{currentBudget}
            </span>
          </div>
        )}

        {/* Completed Indicator */}
        {status === "completed" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-300 tracking-wide">
              Simulation Complete — {metrics.treesPlanted} trees placed
            </span>
          </div>
        )}

        {/* Error Indicator */}
        {status === "error" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-950/80 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300 tracking-wide">
              Simulation Failed
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Control & Stats Panel */}
      <div className="w-full lg:w-96 bg-base-950 lg:border-l border-white/5 flex flex-col shrink-0 relative z-10 shadow-2xl overflow-y-auto h-[40vh] lg:h-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 sticky top-0 bg-base-950/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <Activity className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">
                Command Center
              </h1>
              <p className="text-base-400 text-xs">
                RL Agent Simulation •{" "}
                <span className="capitalize">{status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Stats */}
        <div className="p-6 flex flex-col gap-6">
          <SimulationControls
            onRun={handleRun}
            onStop={stopSimulation}
            isRunning={isRunning}
            isLoading={isLoading}
          />

          <SimulationStats
            metrics={metrics}
            budget={currentBudget}
            showBeforeAfter={showBeforeAfter}
            onToggleBeforeAfter={() => setShowBeforeAfter(!showBeforeAfter)}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
