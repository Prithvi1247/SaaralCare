// components/map/RainfallMap.jsx
// Fixed Leaflet map with proper data fetching, centering, and marker rendering

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabaseClient";

function getRiskColor(riskLabel) {
  if (!riskLabel) return "#3a9fd4"; // default blue
  const label = riskLabel.toLowerCase();
  if (label.includes("high")) return "#ef4444";     // red
  if (label.includes("moderate")) return "#f59e0b"; // orange
  if (label.includes("low")) return "#10b981";      // green
  return "#3a9fd4"; // rain blue
}

export default function RainfallMap({ workerStation = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [workerPos, setWorkerPos] = useState([11, 78]); // fallback center
  const [loading, setLoading] = useState(true);

  // Fetch data once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stations from risk_score table
        const { data: stationsData, error: stError } = await supabase
          .from("risk_score")
          .select("*");

        if (stError) throw stError;
        setStations(stationsData || []);

        // Fetch current worker location
        const phone = typeof window !== "undefined"
          ? sessionStorage.getItem("gs_worker_phone")
          : null;

        if (phone) {
          const { data: worker, error: wError } = await supabase
            .from("workers")
            .select("latitude, longitude")
            .eq("phone", phone)
            .maybeSingle();

          if (!wError && worker?.latitude && worker?.longitude) {
            setWorkerPos([worker.latitude, worker.longitude]);
          }
        }
      } catch (err) {
        console.error("Error fetching map data:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Initialize map once on first render
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: workerPos,
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Store L for use in marker effect
      map._L = L;
    });
  }, []);

  // Add/update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current._L) return;

    const L = mapInstanceRef.current._L;
    const map = mapInstanceRef.current;

    // Clear existing markers (but keep map base layers)
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Re-center map on worker position
    map.setView(workerPos, 11, { animate: false });

    // Add worker marker (blue dot)
    L.circleMarker(workerPos, {
      radius: 12,
      fillColor: "#3b82f6",
      color: "#ffffff",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map).bindPopup("Your Location");

    // Add station markers
    stations.forEach((station) => {
      if (!station.latitude || !station.longitude) return;

      const color = getRiskColor(station.predicted_label);
      const isWorkerStation = workerStation && station.id === workerStation;

      const marker = L.circleMarker([station.latitude, station.longitude], {
        radius: isWorkerStation ? 14 : 10,
        fillColor: color,
        color: isWorkerStation ? "#ffffff" : color,
        weight: isWorkerStation ? 3 : 1,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      // Pulse ring for worker's mapped station
      if (isWorkerStation) {
        L.circleMarker([station.latitude, station.longitude], {
          radius: 22,
          fillColor: "transparent",
          color: color,
          weight: 2,
          opacity: 0.6,
          dashArray: "4,4",
          lineCap: "round",
        }).addTo(map);
      }

      const popupContent = `
        <div style="font-size: 12px; color: #333;">
          <strong>${station.station || station.district}</strong><br/>
          Risk: ${station.predicted_label || "—"}<br/>
          Score: ${(station.risk_score || 0).toFixed(2)}
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }, [stations, workerPos, workerStation]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg bg-navy-900 border border-navy-700"
      style={{ height: "500px" }}
    />
  );
}
