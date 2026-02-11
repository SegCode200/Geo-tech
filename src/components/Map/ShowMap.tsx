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

const ShowMap: React.FC<ShowMapProps> = ({ lat, lng, squareMeters, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!lat || !lng || !containerRef.current) return;

    const area = squareMeters || 0;
    const radius = area > 0 ? Math.sqrt(area / Math.PI) : 30;
    const zoom = getZoomForRadius(radius);

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

        const center = { lat: Number(lat), lng: Number(lng) };
        const map = new g.maps.Map(containerRef.current, {
          center,
          zoom,
          gestureHandling: "greedy",
        });
        mapRef.current = map;

        const marker = new g.maps.Marker({ position: center, map, title: title || "Land location" });
        markerRef.current = marker;

        const infoWindow = new g.maps.InfoWindow({
          content: `<strong>${title || "Land location"}</strong><br/>${area ? `${area} sqm` : "Size: N/A"}`,
        });
        infoWindow.open({ anchor: marker, map, shouldFocus: false } as any);

        if (area > 0) {
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

        // Fix sizing issues when container resizes
        setTimeout(() => {
          g.maps.event.trigger(map, "resize");
          map.setCenter(center);
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
  }, [lat, lng, squareMeters, title]);

  if (!lat || !lng) {
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
