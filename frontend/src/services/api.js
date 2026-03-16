import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 60000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    
    
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    
    return response.data;
  },
  (error) => {
    
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

export const MapService = {
  
  getHeatMap: (cityId) =>
    api.get(`/analysis/heat`, { params: { city: cityId } }),

  
  getFloodRisk: (cityId) =>
    api.get(`/analysis/flood`, { params: { city: cityId } }),

  
  getGreenEquity: (cityId) =>
    api.get(`/analysis/equity`, { params: { city: cityId } }),
};

export const SimulationService = {
  
  triggerRun: (config) =>
    api.post(`/simulate`, config, { timeout: 45000 }),

  
  triggerQuick: (config) =>
    api.post(`/simulate/quick`, config, { timeout: 30000 }),
};

export const AnalyticsService = {
  /**
   * Fetches grid data for a city for analytics.
   * Reuses the /analysis/search endpoint — returns { center, bbox, geojson }.
   * @param {string} city - City name
   * @returns {Promise<Object>}
   */
  getCityData: (city) =>
    api.get(`/analysis/search`, { params: { city } }),
};

export default api;
