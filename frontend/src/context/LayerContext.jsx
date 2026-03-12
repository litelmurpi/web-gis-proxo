import { createContext, useContext, useState } from "react";

const LayerContext = createContext(undefined);

export function LayerProvider({ children }) {
  const [activeLayer, setActiveLayer] = useState("heat");
  const [cityGeoJSON, setCityGeoJSON] = useState(null); // Shared live GeoJSON from search results

  // Keep a unified registry of exact layer configs
  const layers = [
    { id: "heat", name: "Heat Risk", color: "text-red-400" },
    { id: "flood", name: "Flood Risk Model", color: "text-blue-400" },
    { id: "equity", name: "Green Equity", color: "text-emerald-400" },
    { id: "population", name: "Population", color: "text-yellow-400" },
  ];

  return (
    <LayerContext.Provider value={{ activeLayer, setActiveLayer, layers, cityGeoJSON, setCityGeoJSON }}>
      {children}
    </LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error("useLayer must be used within a LayerProvider");
  }
  return context;
}
