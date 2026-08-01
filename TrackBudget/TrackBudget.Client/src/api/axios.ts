import axios from "axios";

import { tokenStorage } from "../utils/storage";
import { useAuthStore } from "../store/authStore";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5098")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

// Centralized axios instance used by all feature APIs.
export const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Attach JWT to every request when present.
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // A 401 means the session is no longer valid; clear auth state
    // so protected pages can redirect to login consistently.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Keep auth store in sync with storage to avoid stale "authenticated"
      // UI state after token expiry/invalid token responses.
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
