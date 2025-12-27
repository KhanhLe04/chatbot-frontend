import { create } from "zustand";
import axios from "axios";
import { User, TokenResponse } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  setUser: (user: User) => void;
}

// Get base URL from environment variable (same as api.ts)
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";

export const authStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  login: async (username: string, password: string) => {
    try {
      // Login endpoint uses form-urlencoded
      // Use axios directly to avoid circular dependency with api.ts
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post<TokenResponse>(
        `${baseURL}/token`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = response.data;

      // Fetch user info with the token
      const userResponse = await axios.get<User>(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      set({
        token: access_token,
        user: userResponse.data,
      });

      // Set cookie for middleware authentication check
      if (typeof document !== "undefined") {
        document.cookie = `auth_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      // Register endpoint
      await axios.post<boolean>(`${baseURL}/register`, {
        username,
        email,
        password,
      });

      // After successful registration, automatically log in
      await get().login(username, password);
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
    });

    // Clear auth cookie
    if (typeof document !== "undefined") {
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    }
  },

  isAuthenticated: () => {
    return get().token !== null && get().user !== null;
  },

  setUser: (user: User) => {
    set({ user });
  },
}));

