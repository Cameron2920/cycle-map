"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";
import Image from "next/image";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ActivitiesMap() {
  const mapContainer = useRef(null);
  const [selectedRides, setSelectedRides] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    async function fetchRides() {
      const res = await fetch("/api/activities");
      if (res.ok) {
        const data = await res.json();
        setRides(data);
      }
      else if(res.status === 401) {
        window.location.href = "/";
      }
    }
    fetchRides();
  }, []);

  function setupRide(map, ride, bounds){
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
      id: `ride-${ride.id}`,
      type: "line",
      source: `ride-${ride.id}`,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#e91e63", "line-width": 3 },
    });
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    // Change cursor on hover
    map.on("mouseenter", `ride-${ride.id}`, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", `ride-${ride.id}`, () => {
      map.getCanvas().style.cursor = "";
    });
  }

  useEffect(() => {
    if (!rides.length) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [43.6532, -79.3832],
      zoom: 10,
    });

    // Add zoom and rotation controls
    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      const bounds = new mapboxgl.LngLatBounds();

      // Add rides to map
      rides.forEach((ride) => {
        setupRide(map, ride, bounds);
      });
      map.on("click", (e) => {
        console.log("clicked");
        const features = map.queryRenderedFeatures(e.point, {
          layers: rides.map((ride) => `ride-${ride.id}`),
        });
        console.log("clicked", features);

        if (!features.length) return;

        // Collect clicked ride(s)
        const selectedRideIds = features.map((feature) => {
          let split = feature.source.split("-");

          if(split.length == 2) {
            return split[1];
          }
          return null;
        });
        console.log("selectedRideIds ", selectedRideIds)
        console.log("clicked rides ", rides.filter(ride => selectedRideIds.includes(ride.id)))
        setSelectedRides(rides.filter(ride => selectedRideIds.includes(ride.id.toString())));
      });
      map.fitBounds(bounds, { padding: 50 });
    });
    return () => map.remove(); // cleanup on unmount
  }, [rides]);

  function formatMovingTime(timeInSeconds) {
    let hours = (timeInSeconds / 3600).toFixed(2);
    return `${hours} hrs`;
  }

  return <div className="relative w-full h-full">
    <div ref={mapContainer} className="w-full h-full" />

    {/* Right-hand side panel */}
    {selectedRides.length > 0 && (
      <div className="absolute top-20 right-4 max-h-[90vh] w-80 bg-white rounded-xl border border-gray-300 shadow-xl p-6 z-10 flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Selected Rides</h2>
          <button
            onClick={() => setSelectedRides([])}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Clear Selection"
          >
            ✕
          </button>
        </div>

        {/* Rides list */}
        <ul className="space-y-4 overflow-y-auto">
          {selectedRides.map((ride) => (
            <li
              key={ride.id}
              className="border rounded-lg p-3 hover:shadow-md transition"
            >
              <h3 className="font-bold text-gray-800">{ride.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(ride.start_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Distance: {(ride.distance / 1000).toFixed(1)} km
              </p>
              <p className="text-sm text-gray-600">
                Moving Time: {formatMovingTime(ride.moving_time)}
              </p>
              <p className="text-sm text-gray-600">
                <a
                  href={`https://www.strava.com/activities/${ride.id}`}
                  className="text-[#FC5200] underline"
                  target="_blank" rel="noopener noreferrer"
                >
                  View on Strava
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="absolute bottom-4 left-4 z-10">
      <Image
        src="/api_logo_pwrdBy_strava_horiz_orange.png"
        alt="Powered by Strava"
        width={120}
        height={24}
      />
    </div>
  </div>;
}
