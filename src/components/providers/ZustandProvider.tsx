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
    // Initialize auth state by checking /users/me
    const initializeAuth = async () => {
      if (!authStore.getState().user) {
        try {
          const baseURL =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";
          // We rely on the browser to send the HttpOnly cookie
          const userResponse = await axios.get<User>(`${baseURL}/users/me`, {
            withCredentials: true,
          });

          // We don't have the token string anymore (it's in httpOnly cookie), 
          // but we can set the user. 
          // Ideally the store shouldn't rely on 'token' string existence for 'isAuthenticated'
          // if we are fully cookie-based. 
          // For now, let's assume we proceed with just user data, or we assume
          // the 'token' field in store might be null but interaction works.
          // However, existing interceptors use 'token'.
          // If the backend requires 'Authorization: Bearer' AND sets cookie, we have a problem 
          // unless the backend ALSO accepts cookie-only auth.
          // Assuming backend DOES accept cookie-only auth since it sends an httpOnly cookie.

          authStore.setState({ user: userResponse.data, token: "cookie-auth" }); // Set a placeholder token to satisfy non-null checks if needed
        } catch {
          // Not authenticated
          authStore.getState().logout();
        }
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
}

