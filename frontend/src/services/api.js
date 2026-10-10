import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kairos_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data payload or handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid session only if not trying to login/register
      const isAuthEndpoint = error.config.url.includes("/auth/login") || error.config.url.includes("/auth/register");
      if (!isAuthEndpoint) {
        localStorage.removeItem("kairos_token");
        localStorage.removeItem("kairos_user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
