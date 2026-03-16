import { useState } from "react";
import MapContainer from "../components/map/MapContainer";
import SimulationControls from "../components/simulation/SimulationControls";
import SimulationStats from "../components/simulation/SimulationStats";
import { useLayer } from "../context/LayerContext";
import { useSimulation } from "../hooks/useSimulation";
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ThermometerSun,
  Waves,
  Users,
  AlignLeft,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const layerIcons = {
  heat: ThermometerSun,
  flood: Waves,
  equity: Users,
  population: AlignLeft,
};

export default function Simulation() {
  const { activeLayer, setActiveLayer, layers } = useLayer();
  const {
    status,
    trees,
    gridAfter,
    metrics,
    error,
    startSimulation,
    stopSimulation,
  } = useSimulation();
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(50);
  const [cityQuery, setCityQuery] = useState("Surabaya");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const handleRun = (city, budget, weights) => {
    setCityQuery(city);
    setCurrentBudget(budget);
    setShowBeforeAfter(false);
    startSimulation(city, budget, weights);
  };

  const isLoading = status === "loading";
  const isRunning = status === "animating";

  return (
    <div className="h-full w-full bg-base-950 flex flex-col lg:flex-row overflow-hidden relative">

      <div className="flex-1 relative z-0">
        <MapContainer
          activeLayer={activeLayer}
          simulationTrees={trees}
          showBeforeAfter={showBeforeAfter}
          gridAfter={gridAfter}
          cityQuery={cityQuery}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-base-950/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-base-950/90 border border-white/10 px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">Computing Optimal Placement</p>
                <p className="text-base-400 text-xs mt-1">Fetching data & running RL agent...</p>
              </div>
            </div>
          </div>
        )}

        {isRunning && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-base-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-white tracking-wide">
              AI Agent Planting... {metrics.treesPlanted}/{currentBudget}
            </span>
          </div>
        )}

        {status === "completed" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-300 tracking-wide">
              Simulation Complete — {metrics.treesPlanted} trees placed
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-950/80 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300 tracking-wide">Simulation Failed</span>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 lg:hidden flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 p-2 bg-base-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full">
            {layers.map((layer) => {
              const Icon = layerIcons[layer.id];
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  title={layer.name}
                  className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 outline-none
                    ${isActive ? "bg-white/10 border border-white/20 shadow-sm" : "bg-transparent border border-transparent hover:bg-white/5"}`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? `scale-110 ${layer.color}` : "opacity-60 text-white"}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </button>
              );
            })}

            <div className="w-px h-7 bg-white/10 mx-1" />

            <button
              onClick={() => setIsMobilePanelOpen(true)}
              title="Command Center"
              className="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 outline-none bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20"
            >
              <Activity className="w-4 h-4 text-primary-400" />
              {(isRunning || isLoading) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobilePanelOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobilePanelOpen(false)}
            />
            <motion.div
              key="mob-sheet"
              className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-base-950 border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col"
              style={{ maxHeight: "82vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <Activity className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">Command Center</h2>
                    <p className="text-base-400 text-xs capitalize">RL Agent · {status}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="p-2 rounded-lg text-base-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 py-5">
                <div className="max-w-md mx-auto px-5 space-y-5">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative hidden lg:flex shrink-0">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute z-20 top-1/2 -translate-y-1/2 -left-5 flex items-center justify-center w-5 h-12 rounded-l-lg bg-base-900 border border-r-0 border-white/10 text-base-400 hover:text-white hover:bg-base-800 transition-colors shadow-xl"
          title={isPanelOpen ? "Hide Panel" : "Show Panel"}
        >
          {isPanelOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden bg-base-950 border-l border-white/5 flex flex-col shrink-0 relative z-10 shadow-2xl h-full ${isPanelOpen ? "w-96" : "w-0 border-l-0"}`}
        >
          <div className="px-6 py-5 border-b border-white/5 sticky top-0 bg-base-950/95 backdrop-blur z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <Activity className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Command Center</h1>
                <p className="text-base-400 text-xs">
                  RL Agent Simulation · <span className="capitalize">{status}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
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
    </div>
  );
}
