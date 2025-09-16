// convert-gpx-to-demo.js
import fs from "fs";
import path from "path";
import { DOMParser } from "xmldom";
import polyline from "@mapbox/polyline";

const gpxDir = "./demo-gpx-files"; // folder containing your GPX files
const outFile = "./components/DemoData.ts";

// helper to parse GPX -> array of [lat, lon]
function parseGPX(gpxContent) {
  const doc = new DOMParser().parseFromString(gpxContent, "text/xml");
  const trkpts = doc.getElementsByTagName("trkpt");
  const coords = [];
  for (let i = 0; i < trkpts.length; i++) {
    const lat = parseFloat(trkpts[i].getAttribute("lat"));
    const lon = parseFloat(trkpts[i].getAttribute("lon"));
    coords.push([lat, lon]);
  }
  return coords;
}

// main
const demoRides = [];

const files = fs.readdirSync(gpxDir).filter((f) => f.endsWith(".gpx"));

files.forEach((file, idx) => {
  const gpxPath = path.join(gpxDir, file);
  const gpxContent = fs.readFileSync(gpxPath, "utf-8");
  const coords = parseGPX(gpxContent);

  if (coords.length === 0) return;

  // encode to polyline
  const encoded = polyline.encode(coords);

  // rough distance (in meters) using haversine
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in m
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  let distance = 0;
  for (let i = 1; i < coords.length; i++) {
    distance += haversine(
      coords[i - 1][0],
      coords[i - 1][1],
      coords[i][0],
      coords[i][1]
    );
  }

  demoRides.push({
    id: idx + 1,
    name: ["Morning Ride", "Afternoon Ride", "Evening Ride"][Math.floor(Math.random() * 3)],
    distance: Math.round(distance),
    moving_time: Math.round(distance / 5), // fake ~5 m/s pace
    start_date: new Date().toISOString(),
    map: {
      summary_polyline: encoded,
    },
  });
});

// write out TS file
const tsContent = `export const demoRides = ${JSON.stringify(demoRides, null, 2)};`;
fs.writeFileSync(outFile, tsContent);

console.log(`✅ Wrote ${demoRides.length} rides to ${outFile}`);
