"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sessionStore } from "@/store/sessionStore";
import { Leaf } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  // Use effect to check and subscribe to sessions
  useEffect(() => {
    const checkRedirection = () => {
      const sessions = sessionStore.getState().sessions;
      if (sessions.length > 0) {
        const latestSession = sessions[0];
        router.replace(`/chat/${latestSession.session_id}`);
      }
    };

    // Check immediately
    checkRedirection();

    // Subscribe to future changes
    const unsubscribe = sessionStore.subscribe(checkRedirection);

    return () => {
      unsubscribe();
    };
  }, [router]);

  // We need to get sessions state for the empty conditional check below
  // BUT using the hook might trigger the error again if HMR is flaky.
  // Let's use useStore hook safely.
  // Wait, if I use hook here, I might get the same error.
  // Is it better to just show loading until redirect?
  // Or use useSyncExternalStore manually? 
  // Let's try to just render the empty state only if we are sure?
  // Actually, if we use the hook, it MUST be at the top level and consistent.
  // The previous error was: Previous: useContext, useCallback. Next: useContext, useEffect.
  // This meant the hook was MISSING in Next render.
  // If I add it back, it should work IF I restart server (which I did).
  // But user still got error.
  // So I will REMOVE the hook usage for `sessions.length === 0` check and just show loading state if not redirected yet.
  // This makes the page simpler: It just redirects. If no sessions, it shows "Welcome".
  // To show "Welcome", I need to know if there are sessions.
  // I will use a simple useState initialized from store.

  // Actually, let's keep it simple.
  // JUST redirect. If no sessions, show default content.
  // To avoid hook issues, I will read state in useEffect.
  // For rendering, I will use a local state that updates via subscription.

  const [hasSessions, setHasSessions] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSessions = () => {
      const sessions = sessionStore.getState().sessions;
      if (sessions.length > 0) {
        const latestSession = sessions[0];
        router.replace(`/chat/${latestSession.session_id}`);
      } else {
        setHasSessions(false);
      }
    };

    checkSessions();

    const unsubscribe = sessionStore.subscribe(checkSessions);
    return () => unsubscribe();
  }, [router]);

  // Show loading while checking
  if (hasSessions === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          <p className="text-text-primary">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show empty state if explicitly no sessions
  if (hasSessions === false) {
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
          💡 Gợi ý: Nhấn vào nút &quot;Cuộc trò chuyện mới&quot; ở sidebar để bắt đầu
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

