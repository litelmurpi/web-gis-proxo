import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLayer } from "../../context/LayerContext";
// import { generateMockGrid } from "../../utils/mockGeoJSON";

// WHY: Terpaksa menggunakan OSM Raster Tile + filter CSS Invert dari sisi client.
// Provider gratis lain seperti Esri Dark Gray membatasi level zoom untuk region Asia Tenggara (blank putih saat di-zoom map level kelurahan).
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

/**
 * Mengkonversi tipe data layer aktif ke aturan MapLibre GL Data-Driven Styling Array
 *
 * @param {'heat' | 'flood' | 'equity' | 'population'} layer - Nama model geospatial yang sedang aktif
 * @returns {Array} MapLibre style expression rule array
 */
const getLayerColorRule = (layer) => {
  switch (layer) {
    case "heat":
      return [
        "interpolate",
        ["linear"],
        ["get", "lst"],
        25,
        "rgba(99, 102, 241, 0.4)", // Indigo (set opacity to 0.4 min so it's always visible)
        29,
        "rgba(234, 179, 8, 0.5)", // Yellow
        33,
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
      // Empty source initial
      map.current.addSource("urban-grid", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
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

      // 4. Interactivity (Hover Tooltips)
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

        // Custom dark-mode HTML for the hover tooltip
        const popupHtml = `
          <div style="background-color: #000; color: #fff; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Cell ID: ${gridId}</h4>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Heat LST:</span>
                <span style="font-weight: 600; color: ${heatScore > 35 ? "#ef4444" : heatScore > 32 ? "#eab308" : "#22c55e"}">${heatScore.toFixed(1)} <span style="font-size: 10px; color: #71717a;">°C</span></span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 24px;">
                <span style="color: #a1a1aa;">Flood Risk:</span>
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

    // Cleanup MapLibre instance on unmount to fix Vite HMR caching issues
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); // Remove lng, lat, zoom deps to prevent re-initializing the whole map

  // Effect to handle City Search queries
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

          // Update Source
          if (map.current.getSource("urban-grid")) {
             map.current.getSource("urban-grid").setData(data.geojson);
             setCityGeoJSON(data.geojson); // Share with AnalyticsPanel via context
          }
          
          // Fly/Fit Bounds to city
          if (data.bbox && data.bbox.length === 4) {
             const [minLon, minLat, maxLon, maxLat] = data.bbox;
             map.current.fitBounds(
               [
                 [minLon, minLat], // southwestern corner of the bounds
                 [maxLon, maxLat]  // northeastern corner of the bounds
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

  // Effect to handle swapping to the 'After' grid when compare is enabled
  useEffect(() => {
    if (!map.current || !map.current.getSource("urban-grid")) return;

    // Use context cityGeoJSON object if viewing 'before' (original)
    // Use simulation gridAfter object if viewing 'after'
    const targetGeoJSON = showBeforeAfter && gridAfter ? gridAfter : cityGeoJSON;
    
    if (targetGeoJSON) {
      map.current.getSource("urban-grid").setData(targetGeoJSON);
    }
  }, [showBeforeAfter, gridAfter, cityGeoJSON]);

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

        // Before/After effect: Dim the base grid if Before/After is active
        map.current.setPaintProperty(
          "urban-grid-fill",
          "fill-opacity",
          showBeforeAfter
            ? [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.4, // Reduced from 0.8 to simulate "cooled down/mitigated"
                15,
                0.15, // Fade out heavily when zoomed in to let trees pop
              ]
            : [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.8,
                15,
                0.3, // Baseline fade
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

  // Effect to render simulated tree markers
  useEffect(() => {
    if (!map.current) return;

    const updateTrees = () => {
      const sourceId = "simulation-trees";
      const layerIdOuter = "simulation-trees-glow";
      const layerIdInner = "simulation-trees-dot";

      // Convert coordinate array to GeoJSON FeatureCollection
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
        // Add source and layers if they don't exist yet
        map.current.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        // Glow effect (outer soft circle)
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
            "circle-color": "#10b981", // emerald-500
            "circle-opacity": 0.3,
            "circle-blur": 1,
          },
        });

        // Core dot (inner sharp circle)
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
            "circle-color": "#34d399", // emerald-400
            "circle-opacity": 1,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#000000",
          },
        });
      } else {
        // Just update the data if source exists
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
      {/* CSS Filter inverts the light OSM map into a dark theme with high contrast */}
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full filter-[invert(100%)_hue-rotate(180deg)_brightness(85%)_contrast(110%)] mix-blend-screen"
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
