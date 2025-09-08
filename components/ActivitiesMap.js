"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ActivitiesMap() {
  const mapContainer = useRef(null);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    async function fetchRides() {
      const res = await fetch("/api/activities");
      if (res.ok) {
        const data = await res.json();
        setRides(data);
      }
    }
    fetchRides();
  }, []);

  useEffect(() => {
    if (!rides.length) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [rides[0].start_longitude || 0, rides[0].start_latitude || 0],
      zoom: 10,
    });

    // Add zoom and rotation controls
    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      const bounds = new mapboxgl.LngLatBounds();

      // Draw polylines
      rides.forEach((ride) => {
        if (!ride.map?.summary_polyline) return;

        const coords = polyline
          .decode(ride.map.summary_polyline)
          .map(([lat, lng]) => [lng, lat]);

        map.addSource(`ride-${ride.id}`, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {type: "LineString", coordinates: coords},
          },
        });

        map.addLayer({
          id: `ride-${ride.id}-layer`,
          type: "line",
          source: `ride-${ride.id}`,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#e91e63", "line-width": 3 },
        });
        coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      });
      map.fitBounds(bounds, { padding: 50 });
    });

    return () => map.remove(); // cleanup on unmount
  }, [rides]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />;
}
