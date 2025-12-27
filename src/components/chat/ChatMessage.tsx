"use client";

import { Message } from "@/types";
import { Leaf, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const time = formatTime(message.timestamp);

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isUser
            ? "bg-secondary"
            : "bg-[#20B2AA]"
          }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-text-primary" />
        ) : (
          <Leaf className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-[80%] rounded-3xl px-4 py-3 ${isUser
              ? "bg-accent text-text-primary"
              : "bg-white text-gray-800 shadow-sm"
            }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources Chips */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex max-w-[80%] flex-wrap gap-2">
            {message.sources.map((source, index) => (
              <div
                key={index}
                className="flex cursor-default items-center rounded-full bg-white px-3 py-1 text-xs text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
                title={source}
              >
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#20B2AA]" />
                <span className="truncate max-w-[200px]">{source}</span>
              </div>
            ))}
          </div>
        )}

        <span className="mt-1 text-xs text-gray-500">{time}</span>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

