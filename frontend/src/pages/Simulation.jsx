import { useState } from "react";
import MapContainer from "../components/map/MapContainer";
import SimulationControls from "../components/simulation/SimulationControls";
import SimulationStats from "../components/simulation/SimulationStats";
import { useLayer } from "../context/LayerContext";
import { useSimulation } from "../hooks/useSimulation";
import { Activity } from "lucide-react";

export default function Simulation() {
  const { activeLayer } = useLayer();
  const { status, trees, metrics, startSimulation, stopSimulation } =
    useSimulation();
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  return (
    <div className="h-full w-full bg-base-950 flex flex-col lg:flex-row overflow-hidden relative">
      {/* KIRI: Peta Simulasi (Full bleed area) */}
      <div className="flex-1 relative z-0 h-[60vh] lg:h-full">
        {/* Placeholder untuk MapContainer. Nanti MapContainer butuh props trees & showBeforeAfter */}
        <MapContainer
          activeLayer={activeLayer}
          simulationTrees={trees}
          showBeforeAfter={showBeforeAfter}
        />

        {/* Indikator Status Simulasi (Melayang di atas peta) */}
        {status === "running" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-base-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-10 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-white tracking-wide">
              AI Agent Optimizing...
            </span>
          </div>
        )}
      </div>

      {/* KANAN: Panel Kontrol & Statistik */}
      <div className="w-full lg:w-96 bg-base-950 lg:border-l border-white/5 flex flex-col shrink-0 relative z-10 shadow-2xl overflow-y-auto h-[40vh] lg:h-full">
        {/* Header Panel Kanan */}
        <div className="px-6 py-5 border-b border-white/5 sticky top-0 bg-base-950/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <Activity className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">
                Command Center
              </h1>
              <p className="text-base-400 text-xs">RL Agent Simulation</p>
            </div>
          </div>
        </div>

        {/* Area Konten Panel Kanan */}
        <div className="p-6 flex flex-col gap-6">
          <SimulationControls
            onRun={startSimulation}
            onStop={stopSimulation}
            isRunning={status === "running"}
          />

          <SimulationStats
            metrics={metrics}
            showBeforeAfter={showBeforeAfter}
            onToggleBeforeAfter={() => setShowBeforeAfter(!showBeforeAfter)}
          />
        </div>
      </div>
    </div>
  );
}
