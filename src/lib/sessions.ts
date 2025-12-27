import { api } from "./api";
import { SessionsResponse } from "@/types";
import { authStore } from "@/store/authStore";

/**
 * Fetch all sessions for the current user
 */
export async function fetchSessions(): Promise<SessionsResponse> {
  const user = authStore.getState().user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await api.get<SessionsResponse>(
    `/sessions/${user.user_id}`
  );
  return response.data;
}

