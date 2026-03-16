import axios from "axios";

// Create Axios Instance with dynamic base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 60000, // 60s — TIF population sampling + grid generation can take 15-30s
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Optionally add Auth tokens here if implemented later
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Fast path: just return the nested data directly
    return response.data;
  },
  (error) => {
    // Standardize error handling
    console.error("API Error Response:", error.response || error.message);

    const customError = new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    );
    customError.status = error.response?.status;
    customError.code = error.code;
    customError.originalError = error;

    return Promise.reject(customError);
  },
);

/* 
  -----------------------------------------
  UrbanInsight specific API services below 
  -----------------------------------------
*/

export const MapService = {
  /**
   * Fetches the Land Surface Temperature (LST) heatmap data.
   * @param {string} cityId - The ID of the city (e.g., 'surabaya')
   * @returns {Promise<GeoJSON>} The LST payload in GeoJSON FeatureCollection format.
   */
  getHeatMap: (cityId) =>
    api.get(`/analysis/heat`, { params: { city: cityId } }),

  /**
   * Fetches the Flood Risk model data.
   * @param {string} cityId
   * @returns {Promise<GeoJSON>}
   */
  getFloodRisk: (cityId) =>
    api.get(`/analysis/flood`, { params: { city: cityId } }),

  /**
   * Fetches Green Equity/Demographic data.
   * @param {string} cityId
   * @returns {Promise<GeoJSON>}
   */
  getGreenEquity: (cityId) =>
    api.get(`/analysis/equity`, { params: { city: cityId } }),
};

export const SimulationService = {
  /**
   * Triggers a full RL simulation run.
   * @param {Object} config - { city, budget, weights: { heat, flood, equity, cost } }
   * @returns {Promise<Object>} Simulation results with before/after metrics, steps, trees GeoJSON
   */
  triggerRun: (config) =>
    api.post(`/simulate`, config, { timeout: 45000 }),

  /**
   * Triggers a quick re-simulation using cached grid data.
   * Skips geocoding and data fetching — only re-runs RL agent.
   * @param {Object} config - { city, budget, weights: { heat, flood, equity, cost } }
   * @returns {Promise<Object>} Simulation results
   */
  triggerQuick: (config) =>
    api.post(`/simulate/quick`, config, { timeout: 30000 }),
};

export default api;
