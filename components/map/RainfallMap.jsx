// components/map/RainfallMap.jsx
// Leaflet must be loaded client-side only (no SSR)
import { useEffect, useRef, useState } from "react";
import { CloudRain, Loader2 } from "lucide-react";

// Mock stations for initial render; replace with API data
const MOCK_STATIONS = [
  { id: "IMD_MUM_001", name: "Santacruz Observatory", lat: 19.0759, lng: 72.8777, rainfall: 22.4, active: true },
  { id: "IMD_MUM_002", name: "Colaba Observatory", lat: 18.9067, lng: 72.8147, rainfall: 8.1, active: true },
  { id: "IMD_MUM_003", name: "Thane Station", lat: 19.2183, lng: 72.9781, rainfall: 35.7, active: true },
  { id: "IMD_MUM_004", name: "Navi Mumbai Station", lat: 19.0330, lng: 73.0297, rainfall: 14.2, active: false },
];

function getRainfallColor(mm) {
  if (mm >= 30) return "#ef4444";  // Heavy — red
  if (mm >= 15) return "#f59e0b";  // Moderate — amber
  if (mm >= 5)  return "#3a9fd4";  // Light — rain blue
  return "#64748b";                 // Trace — grey
}

export default function RainfallMap({ workerStation = null, stations = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const displayStations = stations || MOCK_STATIONS;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return; // already initialised
    if (mapRef.current) return; // already initialised

    // Dynamically import Leaflet (avoids SSR crash)
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      
      
      const map = L.map(mapRef.current, {
        center: [19.076, 72.877],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 18 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Render station markers
      displayStations.forEach((station) => {
        const color = getRainfallColor(station.rainfall);
        const isWorkerStation = workerStation && station.id === workerStation;

        // Custom circle marker
        const marker = L.circleMarker([station.lat, station.lng], {
          radius: isWorkerStation ? 14 : 10,
          fillColor: color,
          color: isWorkerStation ? "#ffffff" : color,
          weight: isWorkerStation ? 3 : 1,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        // Pulse ring for active worker station
        if (isWorkerStation) {
          L.circleMarker([station.lat, station.lng], {
            radius: 22,
            fillColor: "transparent",
            color: color,
            weight: 2,
            opacity: 0.4,
          }).addTo(map);
        }

        marker.bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;background:#0a1628;color:#e2e8f0;border-radius:8px;padding:10px 14px;min-width:180px;border:1px solid rgba(58,159,212,0.2)">
            <div style="font-weight:600;font-size:13px;margin-bottom:6px;">${station.name}</div>
            <div style="font-size:12px;color:#94a3b8;">Rainfall (3hr)</div>
            <div style="font-size:22px;font-weight:700;color:${color};margin-top:2px;">${station.rainfall} <span style="font-size:13px;font-weight:400">mm</span></div>
            <div style="margin-top:8px;font-size:11px;padding:3px 8px;background:${station.active ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)"};border-radius:20px;color:${station.active ? "#34d399" : "#94a3b8"};display:inline-block;">
              ${station.active ? "● Active" : "○ Offline"}
            </div>
          </div>`,
          { className: "leaflet-dark-popup" }
        );
      });

      mapInstanceRef.current = map;
      setLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 bg-navy-900 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-rain-400 animate-spin" />
          <span className="text-slate-400 text-sm">Loading map…</span>
        </div>
      )}

      {/* Legend */}
      {loaded && (
        <div className="absolute bottom-3 left-3 glass-card rounded-lg px-3 py-2.5 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
            <CloudRain className="w-3 h-3 text-rain-400" /> Rainfall (3hr)
          </div>
          {[
            { label: "Heavy ≥30mm", color: "#ef4444" },
            { label: "Moderate ≥15mm", color: "#f59e0b" },
            { label: "Light ≥5mm", color: "#3a9fd4" },
            { label: "Trace", color: "#64748b" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
