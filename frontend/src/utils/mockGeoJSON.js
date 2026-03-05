/**
 * Men-generate grid dummy (FeatureCollection poligon) yang membentang di atas koordinat pusat.
 * Mensimulasikan output prediksi XGBoost dalam bentuk sel grid berukuran spesifik.
 *
 * @param {number} [centerLng=106.8456] - Titik bujur pusat (default: Jakarta)
 * @param {number} [centerLat=-6.2088] - Titik lintang pusat (default: Jakarta)
 * @param {number} [rows=15] - Jumlah baris grid ke bawah
 * @param {number} [cols=15] - Jumlah kolom grid ke samping
 * @param {number} [cellSizeDegree=0.005] - Ukuran sisi setiap sel poligon dalam derajat
 * @returns {GeoJSON.FeatureCollection} Koleksi fitur GeoJSON siap pakai untuk MapLibre
 */
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
      const maxLng = minLng + cellSizeDegree * 0.9; // 0.9 to leave a tiny gap
      const minLat = startLat + r * cellSizeDegree;
      const maxLat = minLat + cellSizeDegree * 0.9;

      // Random mock scores for simulation metrics
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
              [minLng, minLat], // close the ring
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
