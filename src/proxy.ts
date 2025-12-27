import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API Proxy
  if (pathname.startsWith("/api/proxy")) {
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";
    const newPath = pathname.replace("/api/proxy", "");
    console.log(`[Middleware] Proxying ${pathname} -> ${apiBaseUrl}${newPath}`);
    return NextResponse.rewrite(new URL(newPath, apiBaseUrl));
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check for auth token in cookie (backend sets "access_token", previously manually "auth_token")
  // We check 'access_token' primarily.
  const token = request.cookies.get("access_token")?.value || request.cookies.get("auth_token")?.value;

  // If accessing protected route (not public) without token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth pages while authenticated, redirect to chat
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

