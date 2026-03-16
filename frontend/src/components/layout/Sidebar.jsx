import { Layers, ThermometerSun, Waves, Users, AlignLeft } from "lucide-react";
import { useLayer } from "../../context/LayerContext";

const layerIcons = {
  heat: ThermometerSun,
  flood: Waves,
  equity: Users,
  population: AlignLeft,
};

export default function Sidebar({ className = "" }) {
  const { activeLayer, setActiveLayer, layers } = useLayer();

  return (
    <aside
      className={`w-72 bg-base-950 border-r border-white/5 flex flex-col pt-20 h-screen sticky top-0 ${className}`}
    >
      
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
                  className={`p-2 rounded-lg border shadow-card group-hover:shadow-glow-sm transition-all
                    ${isActive ? "bg-base-800 border-white/20" : "bg-base-900 border-white/5"} ${layer.color}`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`}
                    strokeWidth={2}
                  />
                </div>
                <span
                  className={`text-[13px] font-medium transition-colors ${isActive ? "text-white" : "text-base-400 group-hover:text-base-200"}`}
                >
                  {layer.name}
                </span>
              </div>

              
              <div
                className={`w-8 h-4 rounded-full border shadow-card relative transition-colors duration-300
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
    </aside>
  );
}
