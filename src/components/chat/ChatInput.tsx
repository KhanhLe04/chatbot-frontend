"use client";

import { useState, KeyboardEvent } from "react";
import { Image as ImageIcon, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    await onSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      {/* Input Area */}
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-3">
          {/* Attachment Buttons */}
          <div className="flex gap-2">
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <Mic className="h-5 w-5" />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              onKeyDown={handleKeyPress}
              placeholder="Hãy chia sẻ suy nghĩ của bạn với Tâm An..."
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "120px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#20B2AA] text-white transition-colors hover:bg-[#20B2AA]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-3 text-center text-xs text-gray-500">
          Tâm An luôn lắng nghe, nhưng hãy nhớ tìm sự trợ giúp chuyên nghiệp nếu bạn gặp vấn đề nghiêm trọng.
        </p>
      </div>
    </div>
  );
}

