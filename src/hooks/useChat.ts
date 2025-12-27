import { useState, useEffect, useCallback } from "react";
import { chatStore } from "@/store/chatStore";
import { authStore } from "@/store/authStore";
import { Message, ChatResponse, HistoryResponse } from "@/types";
import { api } from "@/lib/api";

export function useChat(sessionId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const { messages, addMessage, setMessages, clear } = chatStore();
    const { user } = authStore();

    // Load history when sessionId changes
    useEffect(() => {
        if (!sessionId || !user?.user_id) return;

        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<HistoryResponse>(
                    `/history/${user.user_id}/${sessionId}`
                );
                // Ensure messages are valid
                const historyMessages = response.data.messages || [];
                setMessages(historyMessages);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        clear(); // Clear previous messages first
        fetchHistory();

    }, [sessionId, user?.user_id, setMessages, clear]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        setIsLoading(true);

        // 1. Optimistic Update (User Message)
        const userMessage: Message = {
            role: "user",
            content,
            timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);

        try {
            // 2. Call API
            const response = await api.post<ChatResponse>("/chat", {
                message: content,
                session_id: sessionId,
            });

            // 3. Add Assistant Message (from Response)
            const assistantMessage: Message = {
                role: "assistant", // "assistant"
                content: response.data.response,
                sources: response.data.sources || [],
                timestamp: new Date().toISOString(),
            };
            addMessage(assistantMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                timestamp: new Date().toISOString(),
            };
            addMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, addMessage, isLoading]);

    return {
        messages,
        sendMessage,
        isLoading,
    };
}
