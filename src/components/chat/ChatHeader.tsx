"use client";

import { Session } from "@/types";
import { Leaf, Info, Search, Settings } from "lucide-react";

interface ChatHeaderProps {
  session: Session;
}

export function ChatHeader({ session }: ChatHeaderProps) {
  const formatUpdateTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `Cập nhật lúc ${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title and Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20B2AA]">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">
                {session.title}
              </h1>
              <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-0.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-green-700">
                  ĐANG LẮNG NGHE
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formatUpdateTime(session.last_updated)}
            </p>
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
            <Info className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
            <Search className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

