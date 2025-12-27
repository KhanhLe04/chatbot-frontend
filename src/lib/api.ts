import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStore } from "@/store/authStore";

// Get base URL from environment variable
const baseURL = "/api/proxy";

// Create axios instance
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor: Add Bearer token from authStore
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getState().token;
    if (token && token !== "cookie-auth" && config.headers) {
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

