"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export function TypingIndicator() {
    return (
        <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#20B2AA]">
                <Leaf className="h-4 w-4 text-white" />
            </div>

            {/* Bubble */}
            <div className="flex items-center rounded-3xl bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                        <motion.div
                            key={dot}
                            className="h-2 w-2 rounded-full bg-gray-400"
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: dot * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
