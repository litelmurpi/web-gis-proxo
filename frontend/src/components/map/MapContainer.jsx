import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { generateMockGrid } from "../../utils/mockGeoJSON";

// Using OpenStreetMap with a CSS invert filter to bypass CartoDB network blocks
// while still achieving a dark mode aesthetic globally (Esri limits zoom in SEA).
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

// Helper to generate MapLibre data-driven styling depending on the active layer metric
const getLayerColorRule = (layer) => {
  switch (layer) {
    case "heat":
      return [
        "interpolate",
        ["linear"],
        ["get", "heatScore"],
        0,
        "rgba(99, 102, 241, 0.05)", // Indigo
        50,
        "rgba(234, 179, 8, 0.4)", // Yellow
        100,
        "rgba(239, 68, 68, 0.7)", // Red
      ];
    case "flood":
      return [
        "interpolate",
        ["linear"],
        ["get", "floodScore"],
        0,
        "rgba(99, 102, 241, 0.05)",
        50,
        "rgba(59, 130, 246, 0.4)", // Blue
        100,
        "rgba(30, 58, 138, 0.7)", // Dark Blue
      ];
    case "equity":
      return [
        "interpolate",
        ["linear"],
        ["get", "equityScore"],
        0,
        "rgba(239, 68, 68, 0.8)", // Low equity = Bad (Red)
        50,
        "rgba(234, 179, 8, 0.4)",
        100,
        "rgba(34, 197, 94, 0.7)", // High equity = Good (Green)
      ];
    case "population":
      return [
        "interpolate",
        ["linear"],
        ["get", "population"],
        0,
        "rgba(99, 102, 241, 0.05)",
        500,
        "rgba(168, 85, 247, 0.4)", // Purple
        1000,
        "rgba(236, 72, 153, 0.7)", // Pink
      ];
    default:
      return "rgba(255, 255, 255, 0.05)";
  }
};

export default function MapContainer({ activeLayer = "heat" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(106.8456); // Jakarta longitude
  const [lat] = useState(-6.2088); // Jakarta latitude
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false, // Using custom placement below
    });

    // Force resize after mount to fix Vite HMR Canvas dimensions
    setTimeout(() => {
      if (map.current) map.current.resize();
    }, 200);

    // Add navigation controls (zoom in/out, rotation)
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add compact attribution
    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    // Wait for the map style to finish loading before adding layers
    map.current.on("load", () => {
      // 1. Add Data Source
      const mockData = generateMockGrid(lng, lat, 20, 20, 0.006);

      map.current.addSource("urban-grid", {
        type: "geojson",
        data: mockData,
      });

      // 2. Add Fill Layer (Heat Risk visualization as default)
      map.current.addLayer({
        id: "urban-grid-fill",
        type: "fill",
        source: "urban-grid",
        paint: {
          // Data-driven styling: initially "heat", updated dynamically by the second useEffect
          "fill-color": getLayerColorRule("heat"),
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.8,
            15,
            0.3, // Fade out slightly when zoomed in
          ],
        },
      });

      // 3. Add Line Layer for subtle cell borders
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

      // 4. Interactivity (Hover & Popups)
      map.current.on("mouseenter", "urban-grid-fill", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "urban-grid-fill", () => {
        map.current.getCanvas().style.cursor = "";
      });

      map.current.on("click", "urban-grid-fill", (e) => {
        if (!e.features.length) return;
        const feature = e.features[0];
        const props = feature.properties;

        // Custom dark-mode HTML for the popup
        const popupHtml = `
          <div style="background-color: #000; color: #fff; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #a1a1aa;">Cell ID: ${props.id}</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span>Heat Risk:</span>
                <span style="font-weight: 600; color: ${props.heatScore > 75 ? "#ef4444" : props.heatScore > 40 ? "#eab308" : "#22c55e"}">${props.heatScore.toFixed(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span>Flood Risk:</span>
                <span style="font-weight: 600; color: ${props.floodScore > 75 ? "#3b82f6" : props.floodScore > 40 ? "#60a5fa" : "#93c5fd"}">${props.floodScore.toFixed(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 16px;">
                <span>Population:</span>
                <span style="font-weight: 600; color: #e4e4e7">${props.population}</span>
              </div>
            </div>
          </div>
        `;

        new maplibregl.Popup({
          closeButton: false,
          className: "urban-popup-dark",
          maxWidth: "300px",
        })
          .setLngLat(e.lngLat)
          .setHTML(popupHtml)
          .addTo(map.current);
      });
    });

    // Cleanup MapLibre instance on unmount to fix Vite HMR caching issues
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lng, lat, zoom]);

  // Update map layer paint properties dynamically whenever the activeLayer prop changes
  useEffect(() => {
    if (!map.current) return;

    const updateStyle = () => {
      if (map.current.getLayer("urban-grid-fill")) {
        map.current.setPaintProperty(
          "urban-grid-fill",
          "fill-color",
          getLayerColorRule(activeLayer),
        );
      }
    };

    // If map style is already loaded, update immediately
    if (map.current.isStyleLoaded()) {
      updateStyle();
    } else {
      // Otherwise wait for the map to idle/finish loading
      map.current.once("idle", updateStyle);
    }
  }, [activeLayer]);

  return (
    <div className="absolute inset-0 w-full h-full bg-base-950">
      {/* CSS Filter inverts the light OSM map into a dark theme with high contrast */}
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full [filter:invert(100%)_hue-rotate(180deg)_brightness(85%)_contrast(110%)] mix-blend-screen"
      />

      {/* Override maplibre popup background globally to fix the pointing arrow style */}
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

      {/* UI overlays will go here (floating panels, toolbars) */}
    </div>
  );
}
