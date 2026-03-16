
export function generateMockGrid(
  centerLng = 106.8456,
  centerLat = -6.2088,
  rows = 15,
  cols = 15,
  cellSizeDegree = 0.005,
) {
  const features = [];
  const startLng = centerLng - (cols / 2) * cellSizeDegree;
  const startLat = centerLat - (rows / 2) * cellSizeDegree;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const minLng = startLng + c * cellSizeDegree;
      const maxLng = minLng + cellSizeDegree * 0.9; 
      const minLat = startLat + r * cellSizeDegree;
      const maxLat = minLat + cellSizeDegree * 0.9;

      
      const heatScore = Math.random() * 100;
      const floodScore = Math.random() * 100;
      const equityScore = Math.random() * 100;
      const population = Math.floor(Math.random() * 1000);

      features.push({
        type: "Feature",
        properties: {
          id: `cell-${r}-${c}`,
          heatScore,
          floodScore,
          equityScore,
          population,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat], 
            ],
          ],
        },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
}
