import { useState, useCallback, useRef } from "react";
import { SimulationService } from "../services/api";

/**
 * Custom hook for RL tree placement simulation.
 *
 * Connects to the real POST /api/simulate backend endpoint
 * and animates tree placement step-by-step on the map.
 *
 * @returns {Object} state and controls for the simulation
 */
export function useSimulation() {
  const [status, setStatus] = useState("idle"); // idle, loading, animating, completed, error
  const [trees, setTrees] = useState([]); // Array of [lng, lat] for map markers
  const [gridAfter, setGridAfter] = useState(null); // GeoJSON updated grid for before/after
  const [metrics, setMetrics] = useState({
    treesPlanted: 0,
    tempReduced: 0,
    floodReduced: 0,
    equityImproved: 0,
    totalReward: 0,
  });
  const [error, setError] = useState(null);
  const [beforeMetrics, setBeforeMetrics] = useState(null);
  const [afterMetrics, setAfterMetrics] = useState(null);

  const intervalRef = useRef(null);
  const abortRef = useRef(false);

  /**
   * Stop the animation loop (data is preserved)
   */
  const stopSimulation = useCallback(() => {
    abortRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus((prev) => (prev === "animating" ? "completed" : prev));
  }, []);

  /**
   * Reset everything to initial state
   */
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setStatus("idle");
    setTrees([]);
    setGridAfter(null);
    setMetrics({
      treesPlanted: 0,
      tempReduced: 0,
      floodReduced: 0,
      equityImproved: 0,
      totalReward: 0,
    });
    setError(null);
    setBeforeMetrics(null);
    setAfterMetrics(null);
  }, [stopSimulation]);

  /**
   * Run the RL simulation.
   *
   * @param {string} city - City name to simulate
   * @param {number} budget - Number of trees (10-500)
   * @param {Object} weights - Reward weights { heat, flood, equity, cost }
   * @param {boolean} quick - Use cached grid (skip data fetching)
   * @param {number} animationSpeedMs - Delay between animated tree placements
   */
  const startSimulation = useCallback(
    async (
      city = "Surabaya",
      budget = 50,
      weights = { heat: 0.35, flood: 0.3, equity: 0.25, cost: 0.1 },
      quick = false,
      animationSpeedMs = 120
    ) => {
      resetSimulation();
      setStatus("loading");
      setError(null);
      abortRef.current = false;

      try {
        const config = { city, budget: Number(budget), weights };
        const data = quick
          ? await SimulationService.triggerQuick(config)
          : await SimulationService.triggerRun(config);

        if (data.error) {
          setError(data.error);
          setStatus("error");
          return;
        }

        // Store full results
        setBeforeMetrics(data.before);
        setAfterMetrics(data.after);
        setGridAfter(data.grid_after);

        const steps = data.steps || [];
        if (steps.length === 0) {
          setStatus("completed");
          return;
        }

        // Animate tree placements step by step
        setStatus("animating");
        let currentStep = 0;

        intervalRef.current = setInterval(() => {
          if (abortRef.current || currentStep >= steps.length) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            if (!abortRef.current) {
              setStatus("completed");
              // Final metrics from backend
              setMetrics({
                treesPlanted: steps.length,
                tempReduced: data.summary?.delta_avg_lst || 0,
                floodReduced: data.summary?.delta_avg_flood || 0,
                equityImproved: data.summary?.delta_avg_equity || 0,
                totalReward: data.summary?.total_reward || 0,
              });
            }
            return;
          }

          const step = steps[currentStep];
          setTrees((prev) => [...prev, [step.lng, step.lat]]);

          // Progressive metrics update (interpolate toward final)
          const progress = (currentStep + 1) / steps.length;
          setMetrics({
            treesPlanted: currentStep + 1,
            tempReduced: Number(
              ((data.summary?.delta_avg_lst || 0) * progress).toFixed(2)
            ),
            floodReduced: Number(
              ((data.summary?.delta_avg_flood || 0) * progress).toFixed(2)
            ),
            equityImproved: Number(
              ((data.summary?.delta_avg_equity || 0) * progress).toFixed(2)
            ),
            totalReward: Number(
              ((data.summary?.total_reward || 0) * progress).toFixed(4)
            ),
          });

          currentStep++;
        }, animationSpeedMs);
      } catch (err) {
        console.error("Simulation API error:", err);
        setError(err.message || "Failed to run simulation");
        setStatus("error");
      }
    },
    [resetSimulation]
  );

  return {
    status,
    trees,
    gridAfter,
    metrics,
    error,
    beforeMetrics,
    afterMetrics,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
}
