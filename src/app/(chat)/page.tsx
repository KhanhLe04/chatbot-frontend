"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sessionStore } from "@/store/sessionStore";
import { Leaf } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const sessions = sessionStore((state) => state.sessions);

  useEffect(() => {
    // If there are sessions, redirect to the latest one
    if (sessions.length > 0) {
      const latestSession = sessions[0]; // Sessions are sorted by last_updated
      router.replace(`/chat/${latestSession.session_id}`);
    }
  }, [sessions, router]);

  // Show empty state if no sessions
  if (sessions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/30">
          <Leaf className="h-10 w-10 text-text-primary/50" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-text-primary">
          Chào mừng đến với Tâm An
        </h2>
        <p className="mb-8 text-center text-gray-600 max-w-md">
          Hãy bắt đầu cuộc trò chuyện mới để chia sẻ suy nghĩ của bạn. 
          Chúng mình ở đây để lắng nghe và đồng hành cùng bạn.
        </p>
        <div className="rounded-xl bg-secondary/20 p-4 text-sm text-text-primary/80">
          💡 Gợi ý: Nhấn vào nút "Cuộc trò chuyện mới" ở sidebar để bắt đầu
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
        <p className="text-text-primary">Đang tải...</p>
      </div>
    </div>
  );
}

