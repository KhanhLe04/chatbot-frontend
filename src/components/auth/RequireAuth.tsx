"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authStore } from "@/store/authStore";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Client-side authentication guard component
 * This is a fallback for routes that need client-side auth checking
 * Middleware handles server-side protection, but this ensures client-side consistency
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const token = authStore((state) => state.token);

  useEffect(() => {
    if (!isAuthenticated()) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, pathname, router]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-text-primary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

