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

    // 2. Hook: Session Store (Single selector for sessions)
    const sessions = sessionStore((state) => state.sessions);

    // 3. Set current session
    useEffect(() => {
        sessionStore.getState().setCurrentSessionId(sessionId);
    }, [sessionId]);

    const currentSession = sessions.find((s) => s.session_id === sessionId);

    return (
        <div className="flex h-full flex-col">
            <ChatHeader session={currentSession || { session_id: sessionId, title: "Cuộc trò chuyện", last_updated: "" }} />
            <div className="flex-1 overflow-hidden">
                <MessageList isLoading={isChatLoading} />
            </div>
            <ChatInput onSendMessage={sendMessage} isLoading={isChatLoading} />
        </div>
    );
}
