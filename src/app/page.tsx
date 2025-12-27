"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Check initial state
    const checkAuth = () => {
      const { token, user } = authStore.getState();
      if (token && user) {
        router.replace("/chat");
      } else {
        // Simple check for now. Ideally we should wait if auth is "loading".
        // But since we don't have an explict loading state in store yet, 
        // we assume if no token at mount (and after Provider init), we login.
        // To be safe against race condition with Provider, we can subscribe.
        router.replace("/login");
      }
    };

    // Subscribe to changes (in case Provider updates shortly after)
    const unsubscribe = authStore.subscribe((state) => {
      if (state.token && state.user) {
        router.replace("/chat");
      }
    });

    // Run initial check
    checkAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary font-sans">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
        <p className="text-text-primary">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
