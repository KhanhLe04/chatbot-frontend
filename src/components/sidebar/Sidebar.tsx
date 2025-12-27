"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Leaf, Plus, Settings, LogOut, User } from "lucide-react";
import { authStore } from "@/store/authStore";
import { sessionStore } from "@/store/sessionStore";
import { fetchSessions } from "@/lib/sessions";
import { SessionList } from "./SessionList";
import { LogoutModal } from "./LogoutModal";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = authStore((state) => state.user);
  const sessions = sessionStore((state) => state.sessions);
  const setSessions = sessionStore((state) => state.setSessions);
  const setCurrentSessionId = sessionStore((state) => state.setCurrentSessionId);

  // Fetch sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        const response = await fetchSessions();
        setSessions(response.sessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [setSessions]);

  const handleNewChat = () => {
    // Generate a random UUID for the new session
    const newSessionId = crypto.randomUUID();
    setCurrentSessionId(newSessionId);
    router.push(`/chat/${newSessionId}`);
  };

  const handleSessionClick = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    router.push(`/chat/${sessionId}`);
  };

  const handleLogout = () => {
    authStore.getState().logout();
    router.push("/login");
  };

  return (
    <>
      <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-[#FAF9F6]">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-200 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20B2AA]">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-text-primary">Tâm An</h1>
            <p className="text-xs text-gray-500">Bạn đồng hành</p>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#20B2AA] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#20B2AA]/90"
          >
            <Plus className="h-4 w-4" />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Đang tải...
            </div>
          ) : (
            <SessionList
              sessions={sessions}
              currentSessionId={
                pathname?.startsWith("/chat/")
                  ? pathname.replace("/chat/", "")
                  : null
              }
              onSessionClick={handleSessionClick}
            />
          )}
        </div>

        {/* User Profile & Settings */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <User className="h-5 w-5 text-text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "Sinh viên"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Cài đặt
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

