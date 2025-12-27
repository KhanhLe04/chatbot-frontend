import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010";
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
