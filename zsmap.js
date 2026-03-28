const fs = require('fs');
const path = require('path');

// ================== Haversine Distance Function ==================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ================== Parse CSV Helper ==================
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim();
    });
    data.push(obj);
  }
  return data;
}

// ================== Main Logic ==================
function main() {
  try {
    // Read the CSV files
    const stationsCSV = fs.readFileSync(path.join(__dirname, 'stations_rows.csv'), 'utf8');
    const zonesCSV = fs.readFileSync(path.join(__dirname, 'zones_rows.csv'), 'utf8');

    const stations = parseCSV(stationsCSV);
    const zones = parseCSV(zonesCSV);

    console.log(`Loaded ${zones.length} zones and ${stations.length} stations.\n`);

    const mappings = [];
    const header = 'zone_name,zone_lat,zone_lng,station_id,station_name,distance_km';

    for (const zone of zones) {
      let nearestStation = null;
      let minDistance = Infinity;

      const zoneLat = parseFloat(zone.latitude);
      const zoneLng = parseFloat(zone.longitude);

      for (const station of stations) {
        const stationLat = parseFloat(station.latitude);
        const stationLng = parseFloat(station.longitude);

        const dist = getDistance(zoneLat, zoneLng, stationLat, stationLng);

        if (dist < minDistance) {
          minDistance = dist;
          nearestStation = station;
        }
      }

      if (nearestStation) {
        console.log(`Mapping: ${zone.zone_name} → ${nearestStation.station_name} (${minDistance.toFixed(2)} km)`);

        mappings.push([
          zone.zone_name,
          zone.latitude,
          zone.longitude,
          nearestStation.id,
          nearestStation.station_name,
          minDistance.toFixed(4)
        ].join(','));
      }
    }

    // Write to CSV
    const outputContent = [header, ...mappings].join('\n');
    fs.writeFileSync(path.join(__dirname, 'zone_station_map.csv'), outputContent);

    console.log(`\n✅ Success! Created "zone_station_map.csv" with ${mappings.length} mappings.`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();