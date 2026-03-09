import { useState, useCallback, useRef } from "react";

// Jakarta center used in mockGeoJSON
const centerLng = 106.8456;
const centerLat = -6.2088;
const cellSizeDegree = 0.005;

/**
 * Custom hook untuk mensimulasikan proses Reinforcement Learning.
 * Karena backend WebSocket belum terhubung, hook ini akan berpura-pura
 * mencari titik panas/banjir dan "menanam" pohon satu per satu secara acak
 * di sekitar area pusat.
 *
 * @returns {Object} State dan kontrol simulasi
 */
export function useSimulation() {
  const [status, setStatus] = useState("idle"); // idle, running, completed
  const [trees, setTrees] = useState([]); // Array koordinat [lng, lat]
  const [metrics, setMetrics] = useState({
    treesPlanted: 0,
    tempReduced: 0,
    floodReduced: 0,
  });

  const intervalRef = useRef(null);

  /**
   * Menghentikan simulasi
   */
  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Reset simulasi ke keadaan awal
   */
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setStatus("idle");
    setTrees([]);
    setMetrics({ treesPlanted: 0, tempReduced: 0, floodReduced: 0 });
  }, [stopSimulation]);

  /**
   * Memulai proses simulasi palsu (Mock AI Agent)
   *
   * @param {number} budget - Menentukan limit pohon yang bisa ditanam
   * @param {number} speedMs - Kecepatan interval per titik (default 200ms)
   */
  const startSimulation = useCallback(
    (budget = 500, speedMs = 150) => {
      resetSimulation();
      setStatus("running");

      // Menghitung target max berdasarkan budget (misal: 1k = 1 pohon per step animasi)
      // Di sini kita batasi maksimal 200 animasi titik agar browser tidak lag.
      const targetTrees = Math.min(Math.floor(budget / 10), 200);
      let currentPlanted = 0;

      intervalRef.current = setInterval(() => {
        if (currentPlanted >= targetTrees) {
          stopSimulation();
          setStatus("completed");
          return;
        }

        // Mock AI RL: Acak posisi di sekitar grid kota
        // Seolah-olah agen menemukan ruang kosong di LST tinggi
        const randomOffsetX = (Math.random() - 0.5) * (15 * cellSizeDegree);
        const randomOffsetY = (Math.random() - 0.5) * (15 * cellSizeDegree);

        const newTree = [centerLng + randomOffsetX, centerLat + randomOffsetY];

        setTrees((prev) => [...prev, newTree]);
        setMetrics((prev) => ({
          treesPlanted: prev.treesPlanted + 1,
          // Mock rumus simplifikasi dampak (diminishing returns)
          tempReduced: Number(
            (prev.tempReduced + 0.02 * Math.random()).toFixed(2),
          ),
          floodReduced: Number(
            (prev.floodReduced + 0.05 * Math.random()).toFixed(2),
          ),
        }));

        currentPlanted++;
      }, speedMs);
    },
    [resetSimulation, stopSimulation],
  );

  return {
    status,
    trees,
    metrics,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
}
