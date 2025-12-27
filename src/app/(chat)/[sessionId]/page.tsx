"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sessionStore } from "@/store/sessionStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  // 1. Hook: Chat Logic (contains internal hooks)
  // Must be unconditional and stable order.
  const { sendMessage, isLoading: isChatLoading } = useChat(sessionId);

  // 2. Hook: Local State
  const [isPageLoading, setIsPageLoading] = useState(true);

  // 3. Hook: Session Store (Single selector for sessions)
  const sessions = sessionStore((state) => state.sessions);

  // 4. Hook: Effect to handle session validation
  useEffect(() => {
    // Access action directly to avoid extra hook subscription
    sessionStore.getState().setCurrentSessionId(sessionId);

    // Simple logic: if sessions are loaded, we are done loading page.
    setIsPageLoading(false);
  }, [sessionId, sessions]);

  const currentSession = sessions.find((s) => s.session_id === sessionId);

  // 5. Conditional Rendering - ONLY after all hooks
  if (isPageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          <p className="text-text-primary">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader session={currentSession || { session_id: sessionId, title: "Cuộc trò chuyện", last_updated: "" }} />
      <div className="flex-1 overflow-hidden">
        <MessageList sessionId={sessionId} isLoading={isChatLoading} />
      </div>
      <ChatInput sessionId={sessionId} onSendMessage={sendMessage} isLoading={isChatLoading} />
    </div>
  );
}
