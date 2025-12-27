"use client";

import { ReactNode, useEffect } from "react";
import { authStore } from "@/store/authStore";
import axios from "axios";
import { User } from "@/types";

interface ZustandProviderProps {
  children: ReactNode;
}

/**
 * Zustand Provider wrapper
 * Initializes auth state from cookie on mount
 */
export function ZustandProvider({ children }: ZustandProviderProps) {
  useEffect(() => {
    // Initialize token from cookie if available
    const initializeAuth = async () => {
      if (typeof document === "undefined") return;

      // Get token from cookie
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );
      const token = authCookie?.split("=")[1];

      if (token && !authStore.getState().token) {
        // Set token in store
        authStore.setState({ token });

        // Fetch user info
        try {
          const baseURL =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";
          const userResponse = await axios.get<User>(`${baseURL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          authStore.setState({ user: userResponse.data });
        } catch {
          // Token is invalid, clear it
          authStore.getState().logout();
        }
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
}

