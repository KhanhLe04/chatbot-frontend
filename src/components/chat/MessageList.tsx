"use client";

import { useEffect, useRef } from "react";
import { chatStore } from "@/store/chatStore";
import { Message } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  isLoading?: boolean;
}

export function MessageList({ isLoading }: MessageListProps) {
  const messages = chatStore((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  let currentGroup: Message[] = [];

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp);
    const dateStr = formatDate(messageDate);

    if (dateStr !== currentDate) {
      if (currentGroup.length > 0) {
        groupedMessages.push({ date: currentDate, messages: currentGroup });
      }
      currentDate = dateStr;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });

  if (currentGroup.length > 0) {
    groupedMessages.push({ date: currentDate, messages: currentGroup });
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-bg-primary px-6 py-4">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {groupedMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500">
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Separator */}
              <div className="my-6 flex items-center justify-center">
                <div className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                  {group.date}
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {group.messages.map((message, index) => (
                  <ChatMessage key={`${message.timestamp}-${index}`} message={message} />
                ))}
              </div>
            </div>
          ))
        )}
        {/* Typing Indicator */}
        {isLoading && (
          <div className="py-2">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return "Hôm nay";
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  }

  // Format: "24 Tháng 10"
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return `${date.getDate()} ${months[date.getMonth()]}`;
}

