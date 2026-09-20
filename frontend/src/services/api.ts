import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

export const TOKEN_STORAGE_KEY = "hacktrack-token";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
