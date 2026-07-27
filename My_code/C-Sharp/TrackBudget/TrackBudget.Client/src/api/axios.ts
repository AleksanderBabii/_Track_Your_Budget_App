import axios from "axios";

import { tokenStorage } from "../utils/storage";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5098")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.remove();
    }
    return Promise.reject(error);
  },
);
