import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStore } from "@/store/authStore";

// Get base URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";

// Create axios instance
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add Bearer token from authStore
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 → trigger logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Trigger logout from authStore
      authStore.getState().logout();
      // Redirect to login page (client-side only)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

