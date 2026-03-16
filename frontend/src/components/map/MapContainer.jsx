import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLayer } from "../../context/LayerContext";

const OSM_STYLE = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const getLayerColorRule = (layer) => {
  switch (layer) {
    case "heat":
      return [
        "interpolate",
        ["linear"],
        ["get", "lst"],
        28,
        "rgba(99, 102, 241, 0.4)", 
        31,
        "rgba(234, 179, 8, 0.5)", 
        34,
        "rgba(239, 68, 68, 0.7)", 
      ];
    case "flood":
      return [
        "interpolate",
        ["linear"],
        ["get", "floodScore"],
        0,
        "rgba(99, 102, 241, 0.05)",
        50,
        "rgba(59, 130, 246, 0.4)", 
        100,
        "rgba(30, 58, 138, 0.7)", 
      ];
    case "equity":
      return [
        "interpolate",
        ["linear"],
        ["get", "equityScore"],
        0,
        "rgba(239, 68, 68, 0.8)", 
        50,
        "rgba(234, 179, 8, 0.4)",
        100,
        "rgba(34, 197, 94, 0.7)", 
      ];
    case "population":
      return [
        "interpolate",
        ["linear"],
        ["get", "population"],
        0,
        "rgba(99, 102, 241, 0.05)",
        500,
        "rgba(168, 85, 247, 0.3)",  
        1500,
        "rgba(236, 72, 153, 0.55)", 
        3500,
        "rgba(244, 63, 94, 0.8)",   
      ];
    default:
      return "rgba(255, 255, 255, 0.05)";
  }
};

export default function MapContainer({
  activeLayer = "heat",
  simulationTrees = [],
  showBeforeAfter = false,
  gridAfter = null,
  cityQuery = null,
  onLoadingChange = () => {},
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(112.7688);
  const [lat, setLat] = useState(-7.2504);
  const [zoom, setZoom] = useState(12);
  const { cityGeoJSON, setCityGeoJSON } = useLayer();

  useEffect(() => {
    if (map.current) return; 

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false, 
    });

    
    setTimeout(() => {
      if (map.current) map.current.resize();
    }, 200);

    
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    
    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    
    map.current.on("load", () => {
      
      map.current.addSource("urban-grid", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      
      map.current.addLayer({
        id: "urban-grid-fill",
        type: "fill",
        source: "urban-grid",
        paint: {
          
          "fill-color": getLayerColorRule("heat"),
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.8,
            15,
            0.3, 
          ],
        },
      });

      
      map.current.addLayer({
        id: "urban-grid-line",
        type: "line",
        source: "urban-grid",
        paint: {
          "line-color": "#ffffff",
          "line-opacity": 0.1,
          "line-width": 1,
        },
      });

      
      const hoverPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "urban-popup-dark",
        maxWidth: "320px",
      });

      map.current.on("mousemove", "urban-grid-fill", (e) => {
        if (!e.features.length) return;
        map.current.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];
        const props = feature.properties;
        
        const heatScore = props.lst || 0;
        const floodScore = props.floodScore || 0;
        const equityScore = props.equityScore || 0;
        const pop = props.population || 0;
        const gridId = props.grid_idx_x !== undefined ? `${props.grid_idx_x}_${props.grid_idx_y}` : (props.id || "N/A");

        
        const popupHtml = `
          <div style="background-color: #000; color: #fff; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Cell ID: ${gridId}</h4>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Est. Temp:</span>
                <span style="font-weight: 600; color: ${heatScore > 33 ? "#ef4444" : heatScore > 30 ? "#eab308" : "#22c55e"}">${heatScore.toFixed(1)} <span style="font-size: 10px; color: #71717a;">°C</span></span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Flood Vuln:</span>
                <span style="font-weight: 600; color: ${floodScore > 75 ? "#3b82f6" : floodScore > 40 ? "#60a5fa" : "#93c5fd"}">${floodScore.toFixed(1)} <span style="font-size: 10px; color: #71717a;">%</span></span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Green Equity:</span>
                <span style="font-weight: 600; color: ${equityScore < 30 ? "#f87171" : equityScore < 60 ? "#fbbf24" : "#10b981"}">${equityScore.toFixed(1)} <span style="font-size: 10px; color: #71717a;">idx</span></span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Population:</span>
                <span style="font-weight: 600; color: #e4e4e7">${pop.toLocaleString()} <span style="font-size: 10px; color: #71717a;">p</span></span>
              </div>
            </div>
          </div>
        `;

        hoverPopup.setLngLat(e.lngLat).setHTML(popupHtml).addTo(map.current);
      });

      map.current.on("mouseleave", "urban-grid-fill", () => {
        map.current.getCanvas().style.cursor = "";
        hoverPopup.remove();
      });
    });

    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); 

  
  useEffect(() => {
    if (!map.current || !cityQuery) return;

    const fetchCityData = async () => {
      onLoadingChange(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
        const response = await fetch(`${apiBase}/analysis/search?city=${encodeURIComponent(cityQuery)}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.error) {
            console.error("Backend error:", data.error);
            onLoadingChange(false);
            return;
          }

          
          if (map.current.getSource("urban-grid")) {
             map.current.getSource("urban-grid").setData(data.geojson);
             setCityGeoJSON(data.geojson); 
          }
          
          
          if (data.bbox && data.bbox.length === 4) {
             const [minLon, minLat, maxLon, maxLat] = data.bbox;
             map.current.fitBounds(
               [
                 [minLon, minLat], 
                 [maxLon, maxLat]  
               ],
               { padding: 40, duration: 1500 }
             );
          } else if (data.center) {
             map.current.flyTo({ center: data.center, zoom: 12, duration: 1500 });
          }
        }
      } catch (err) {
        console.error("Failed to fetch city grid:", err);
      } finally {
        onLoadingChange(false);
      }
    };

    if (map.current.isStyleLoaded()) {
      fetchCityData();
    } else {
      map.current.once("idle", fetchCityData);
    }
  }, [cityQuery]);

  
  useEffect(() => {
    if (!map.current || !map.current.getSource("urban-grid")) return;

    
    
    const targetGeoJSON = showBeforeAfter && gridAfter ? gridAfter : cityGeoJSON;
    
    if (targetGeoJSON) {
      map.current.getSource("urban-grid").setData(targetGeoJSON);
    }
  }, [showBeforeAfter, gridAfter, cityGeoJSON]);

  
  useEffect(() => {
    if (!map.current) return;

    const updateStyle = () => {
      if (map.current.getLayer("urban-grid-fill")) {
        map.current.setPaintProperty(
          "urban-grid-fill",
          "fill-color",
          getLayerColorRule(activeLayer),
        );

        
        map.current.setPaintProperty(
          "urban-grid-fill",
          "fill-opacity",
          showBeforeAfter
            ? [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.4, 
                15,
                0.15, 
              ]
            : [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.8,
                15,
                0.3, 
              ],
        );
      }
    };

    if (map.current.isStyleLoaded()) {
      updateStyle();
    } else {
      map.current.once("idle", updateStyle);
    }
  }, [activeLayer, showBeforeAfter]);

  
  useEffect(() => {
    if (!map.current) return;

    const updateTrees = () => {
      const sourceId = "simulation-trees";
      const layerIdOuter = "simulation-trees-glow";
      const layerIdInner = "simulation-trees-dot";

      
      const geojson = {
        type: "FeatureCollection",
        features: simulationTrees.map((coords) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
        })),
      };

      if (!map.current.getSource(sourceId)) {
        
        map.current.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        
        map.current.addLayer({
          id: layerIdOuter,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              4,
              15,
              12,
            ],
            "circle-color": "#10b981", 
            "circle-opacity": 0.3,
            "circle-blur": 1,
          },
        });

        
        map.current.addLayer({
          id: layerIdInner,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              2,
              15,
              4,
            ],
            "circle-color": "#34d399", 
            "circle-opacity": 1,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#000000",
          },
        });
      } else {
        
        map.current.getSource(sourceId).setData(geojson);
      }
    };

    if (map.current.isStyleLoaded()) {
      updateTrees();
    } else {
      map.current.once("idle", updateTrees);
    }
  }, [simulationTrees]);

  return (
    <div className="absolute inset-0 w-full h-full bg-base-950">
      
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full filter-[invert(100%)_hue-rotate(180deg)_brightness(85%)_contrast(110%)] mix-blend-screen"
      />

      
      <style>{`
        .urban-popup-dark .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .urban-popup-dark .maplibregl-popup-tip {
          border-top-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>

      
    </div>
  );
}
