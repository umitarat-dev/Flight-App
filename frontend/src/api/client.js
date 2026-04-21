import axios from "axios";

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const isStagingHost =
  typeof window !== "undefined" &&
  window.location.hostname.includes("staging");

const DEFAULT_API_BASE_URL = isLocalHost
  ? "http://127.0.0.1:8000"
  : isStagingHost
    ? "https://umitdev-flight-backend-staging.onrender.com"
    : "https://umitdev-flight-backend.onrender.com";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const TOKEN_KEY = "flight_app_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};
