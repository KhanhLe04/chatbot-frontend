"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #FFF8DC 0%, #FFE4E1 50%, #E0F7FA 100%)",
            "linear-gradient(135deg, #FFE4E1 0%, #E0F7FA 50%, #FFF8DC 100%)",
            "linear-gradient(135deg, #E0F7FA 0%, #FFF8DC 50%, #FFE4E1 100%)",
            "linear-gradient(135deg, #FFF8DC 0%, #FFE4E1 50%, #E0F7FA 100%)",
          ],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "400% 400%",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

