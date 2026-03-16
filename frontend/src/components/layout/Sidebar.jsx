import { useState } from "react";
import { Layers, ThermometerSun, Waves, Users, AlignLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useLayer } from "../../context/LayerContext";

const layerIcons = {
  heat: ThermometerSun,
  flood: Waves,
  equity: Users,
  population: AlignLeft,
};

export default function Sidebar({ className = "" }) {
  const { activeLayer, setActiveLayer, layers } = useLayer();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <aside
        className={`
          hidden lg:flex h-screen sticky top-0 flex-col pt-20
          bg-base-950 border-r border-white/5
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "w-72" : "w-0 border-r-0"}
          ${className}
        `}
      >
        <div className="w-72 flex flex-col flex-1 min-w-0">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xs font-mono font-bold tracking-widest text-base-500 uppercase flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4" />
              Active Layers
            </h2>
            <p className="text-[13px] text-base-400 font-body">
              Manage geospatial models.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {layers.map((layer) => {
              const Icon = layerIcons[layer.id];
              const isActive = activeLayer === layer.id;

              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left outline-none group
                    ${isActive ? "bg-white/10 border border-white/20 shadow-sm" : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border transition-all
                        ${isActive ? "bg-base-800 border-white/20" : "bg-base-900 border-white/5"} ${layer.color}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} strokeWidth={2} />
                    </div>
                    <span
                      className={`text-[13px] font-medium transition-colors ${isActive ? "text-white" : "text-base-400 group-hover:text-base-200"}`}
                    >
                      {layer.name}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-4 rounded-full border relative transition-colors duration-300
                    ${isActive ? "bg-primary-500/20 border-primary-500/50" : "bg-base-800 border-white/5"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 shadow-sm
                      ${isActive ? "left-4 bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "left-0.5 bg-base-500"}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/5">
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-widest text-center">
              City Data: Surabaya
            </p>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          hidden lg:flex fixed z-20 top-1/2 -translate-y-1/2
          transition-all duration-300 ease-in-out
          ${isOpen ? "left-72" : "left-0"}
          items-center justify-center
          w-5 h-12 rounded-r-lg
          bg-base-900 border border-l-0 border-white/10
          text-base-400 hover:text-white hover:bg-base-800
          transition-colors shadow-xl
        `}
        title={isOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
    </>
  );
}
