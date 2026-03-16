import MapContainer from "../components/map/MapContainer";
import MapLegend from "../components/map/MapLegend";
import AnalyticsPanel from "../components/charts/AnalyticsPanel";
import { useLayer } from "../context/LayerContext";
import {
  ThermometerSun,
  Waves,
  Users,
  AlignLeft,
  BarChart3,
  Search,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import EmptyState from "../components/common/EmptyState";
import { AlertCircle } from "lucide-react";

const layerIcons = {
  heat: ThermometerSun,
  flood: Waves,
  equity: Users,
  population: AlignLeft,
};

export default function MapExplorer() {
  const { activeLayer, setActiveLayer, layers } = useLayer();
  const [isMobileAnalyticsOpen, setIsMobileAnalyticsOpen] = useState(false);
  
  
  const [searchInput, setSearchInput] = useState("");
  const [cityQuery, setCityQuery] = useState(null); 
  const [isMapLoading, setIsMapLoading] = useState(false);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCityQuery(searchInput.trim());
    }
  };

  if (!layers || layers.length === 0) {
    return (
      <div className="h-full w-full bg-base-950 flex items-center justify-center p-6">
        <EmptyState
          title="Map Layers Unavailable"
          message="Failed to connect to the geospatial data service. Please try again later."
          icon={<AlertCircle className="w-10 h-10 text-red-500" />}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-base-950 relative overflow-hidden flex">
      
      <div className="absolute inset-0 z-0">
        <MapContainer 
          activeLayer={activeLayer} 
          cityQuery={cityQuery} 
          onLoadingChange={setIsMapLoading}
        />
      </div>

      
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-24 z-10 w-11/12 md:w-96">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-base-950/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-400" />
            <input 
              type="text"
              placeholder="Search city administrative boundaries..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent border-none text-white placeholder:text-base-500 text-sm pl-9 pr-4 py-2 focus:ring-0 focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={isMapLoading}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
          >
            {isMapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      
      <MapLegend />
      <AnalyticsPanel
        isOpen={isMobileAnalyticsOpen}
        onClose={() => setIsMobileAnalyticsOpen(false)}
      />

      
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
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 outline-none
                  ${isActive ? "bg-white/10 border border-white/20 shadow-sm" : "bg-transparent border border-transparent hover:bg-white/5"}`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? `scale-110 ${layer.color}` : "opacity-60 text-white"}`}
                />

                
                {isActive && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
            );
          })}

          
          <div className="w-px h-8 bg-white/10 mx-1" />

          
          <button
            onClick={() => setIsMobileAnalyticsOpen(true)}
            title="City Analytics"
            className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 outline-none bg-transparent border border-transparent hover:bg-white/5"
          >
            <BarChart3 className="w-5 h-5 opacity-60 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
