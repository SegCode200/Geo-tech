import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

interface ShowMapProps {
  lat?: number;
  lng?: number;
  squareMeters?: number;
  title?: string;
  coordinates?: number[][];
  bearings?: { distance: number; bearing: number }[];
  surveyType?: string;
}

const getZoomForRadius = (radiusMeters: number | null) => {
  if (!radiusMeters) return 15;
  if (radiusMeters < 20) return 18;
  if (radiusMeters < 50) return 17;
  if (radiusMeters < 200) return 15;
  if (radiusMeters < 1000) return 13;
  return 11;
};

const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load script"));
    document.head.appendChild(script);
  });
};

const ShowMap: React.FC<ShowMapProps> = ({ lat, lng, squareMeters, title, coordinates, bearings, surveyType }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const key = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

    if (!key) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY is not set. Google Maps will not load.");
      return;
    }

    const src = `https://maps.googleapis.com/maps/api/js?key=${key}`;

    let cancelled = false;

    loadScript(src)
      .then(() => {
        if (cancelled) return;
        const g = (window as any).google;
        if (!g) throw new Error("Google maps SDK not available");

        let center: { lat: number; lng: number };
        let zoom = 15;

        if (coordinates && coordinates.length > 0) {
          // Calculate center from coordinates
          const lats = coordinates.map(c => c[0]);
          const lngs = coordinates.map(c => c[1]);
          center = {
            lat: (Math.min(...lats) + Math.max(...lats)) / 2,
            lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
          };
          // Calculate zoom based on bounds
          const latRange = Math.max(...lats) - Math.min(...lats);
          const lngRange = Math.max(...lngs) - Math.min(...lngs);
          const maxRange = Math.max(latRange, lngRange);
          zoom = maxRange > 0.01 ? 13 : maxRange > 0.001 ? 15 : 17;
        } else if (lat && lng) {
          center = { lat: Number(lat), lng: Number(lng) };
          const area = squareMeters || 0;
          const radius = area > 0 ? Math.sqrt(area / Math.PI) : 30;
          zoom = getZoomForRadius(radius);
        } else {
          return; // No coordinates
        }

        const map = new g.maps.Map(containerRef.current, {
          center,
          zoom,
          gestureHandling: "greedy",
        });
        mapRef.current = map;

        if (coordinates && coordinates.length > 0) {
          // Draw polygon
          const polygonCoords = coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
          new g.maps.Polygon({
            paths: polygonCoords,
            strokeColor: "#2563eb",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#2563eb",
            fillOpacity: 0.15,
            map,
          });

          // Add markers for each point
          const markers: any[] = [];
          coordinates.forEach((coord, index) => {
            const marker = new g.maps.Marker({
              position: { lat: coord[0], lng: coord[1] },
              map,
              label: `${index + 1}`,
              title: `Point ${index + 1}`,
            });
            markers.push(marker);
          });

          // Add bearing info if available
          if (bearings && bearings.length > 0 && surveyType === "BEARING") {
            bearings.forEach((bearing, index) => {
              const start = coordinates[index];
              const end = coordinates[(index + 1) % coordinates.length];
              if (start && end) {
                new g.maps.InfoWindow({
                  content: `Distance: ${bearing.distance.toFixed(2)}m<br>Bearing: ${bearing.bearing.toFixed(2)}°`,
                  position: {
                    lat: (start[0] + end[0]) / 2,
                    lng: (start[1] + end[1]) / 2
                  },
                  map,
                });
              }
            });
          }

          // Fit bounds to polygon
          const bounds = new g.maps.LatLngBounds();
          coordinates.forEach(coord => bounds.extend({ lat: coord[0], lng: coord[1] }));
          map.fitBounds(bounds);
        } else if (lat && lng) {
          // Original point and circle logic
          const marker = new g.maps.Marker({ position: center, map, title: title || "Land location" });
          markerRef.current = marker;

          const infoWindow = new g.maps.InfoWindow({
            content: `<strong>${title || "Land location"}</strong><br/>${squareMeters ? `${squareMeters} sqm` : "Size: N/A"}`,
          });
          infoWindow.open({ anchor: marker, map, shouldFocus: false } as any);

          if (squareMeters && squareMeters > 0) {
            const radius = Math.sqrt(squareMeters / Math.PI);
            const circle = new g.maps.Circle({
              strokeColor: "#2563eb",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#2563eb",
              fillOpacity: 0.15,
              map,
              center,
              radius,
            });
            circleRef.current = circle;
          }
        }

        // Fix sizing issues when container resizes
        setTimeout(() => {
          g.maps.event.trigger(map, "resize");
          if (coordinates && coordinates.length > 0) {
            const bounds = new g.maps.LatLngBounds();
            coordinates.forEach(coord => bounds.extend({ lat: coord[0], lng: coord[1] }));
            map.fitBounds(bounds);
          } else {
            map.setCenter(center);
          }
        }, 0);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps:", err);
      });

    return () => {
      cancelled = true;
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (mapRef.current) {
        // Google Maps API doesn't expose a map.remove(), just clear references
        mapRef.current = null;
      }
    };
  }, [lat, lng, squareMeters, title, coordinates, bearings, surveyType]);

  if (!coordinates && !lat && !lng) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-700">Coordinates not available for this land.</p>
      </div>
    );
  }

  const area = squareMeters || 0;

  return (
    <div className="w-full h-[60vh] md:h-[70vh]">
      <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden" />

      <div className="mt-3 text-right">
        <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-semibold shadow-sm">
          {area ? `${area} sqm` : "Size: N/A"}
        </span>
      </div>
    </div>
  );
};

export default ShowMap;
