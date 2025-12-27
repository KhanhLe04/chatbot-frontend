"use client";

import { Session } from "@/types";
import { Leaf, Heart, GraduationCap } from "lucide-react";

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  timeAgo: string;
  onClick: () => void;
}

/**
 * Get icon for session based on title/content
 */
function getSessionIcon(title: string) {
  const lowerTitle = (title || "").toLowerCase();
  if (lowerTitle.includes("tình cảm") || lowerTitle.includes("yêu")) {
    return <Heart className="h-4 w-4 text-orange-500" />;
  }
  if (
    lowerTitle.includes("học") ||
    lowerTitle.includes("thi") ||
    lowerTitle.includes("tương lai") ||
    lowerTitle.includes("định hướng")
  ) {
    return <GraduationCap className="h-4 w-4 text-blue-500" />;
  }
  return <Leaf className="h-4 w-4 text-[#20B2AA]" />;
}

export function SessionItem({
  session,
  isActive,
  timeAgo,
  onClick,
}: SessionItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${isActive
          ? "bg-accent text-text-primary"
          : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <div className="flex-shrink-0">{getSessionIcon(session.title)}</div>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${isActive ? "font-medium" : "font-normal"
            }`}
        >
          {session.title}
        </p>
        <p
          className={`text-xs ${isActive ? "text-text-primary/70" : "text-gray-500"
            }`}
        >
          {timeAgo}
        </p>
      </div>
    </button>
  );
}

