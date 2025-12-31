// useChat.ts - Streaming Implementation with Fallback
import { useState, useEffect, useCallback, useRef } from "react";
import { chatStore } from "@/store/chatStore";
import { authStore } from "@/store/authStore";
import { sessionStore } from "@/store/sessionStore";
import { fetchSessions } from "@/lib/sessions";
import { Message, HistoryResponse } from "@/types";
import { api } from "@/lib/api";

export function useChat(sessionId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const { messages, addMessage, setMessages, clear, updateLastMessage } = chatStore();
    const { user, token } = authStore();
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load history when sessionId changes
    useEffect(() => {
        if (!sessionId || !user?.user_id) return;

        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<HistoryResponse>(
                    `/history/${user.user_id}/${sessionId}`
                );
                const historyMessages = response.data.messages || [];
                setMessages(historyMessages);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        clear();
        fetchHistory();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [sessionId, user?.user_id, setMessages, clear]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        // 1. Optimistic Update (User Message)
        const userMessage: Message = {
            role: "user",
            content,
            timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);

        // 2. Add Placeholder Assistant Message
        const assistantMessageStub: Message = {
            role: "assistant", // "assistant"
            content: "", // Start empty
            sources: [],
            timestamp: new Date().toISOString(),
        };
        addMessage(assistantMessageStub);

        try {
            // 3. Call API using fetch for Streaming
            // Determine API URL (use env var or proxy)
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7010"; // Default, but Proxy usually handles /api/proxy
            // Since we are Client Side, we should use the Proxy path "/api/proxy" to avoid CORS and Auth issues if configured
            // BUT, useChat runs in browser.
            const endpoint = "/api/proxy/chat";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: content,
                    session_id: sessionId,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authStore.getState().logout();
                }
                throw new Error(`API Error: ${response.statusText}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process buffer
                const lines = buffer.split("\n\n"); // Standard SSE delimiter
                buffer = lines.pop() || ""; // Keep incomplete line

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    // CASE 1: SSE Logic (data: prefix)
                    if (trimmed.startsWith("data: ")) {
                        const jsonStr = trimmed.slice(6);
                        if (jsonStr === "[DONE]") continue;

                        try {
                            const data = JSON.parse(jsonStr);

                            // Streaming Token
                            if (data.token) {
                                updateLastMessage(data.token);
                            }
                            // Final Decision / Sources
                            else if (data.decision || "sources" in data) {
                                // Can handle sources update here if store supports it
                                // For now, maybe just append or ignore if text is sufficient
                            }
                            // Error in stream
                            else if (data.error) {
                                console.error("Stream Error:", data.error);
                                updateLastMessage("\n[Error: " + data.error + "]");
                            }

                            // Handle full response object update if available
                            if (data.response && isFirstChunk) {
                                // This might be the "Raw JSON" inside SSE? verify.
                            }

                        } catch (e) {
                            console.warn("Failed to parse SSE JSON:", jsonStr);
                        }
                    }
                    // CASE 2: Raw JSON Fallback (The User's specific issue)
                    // If the backend sent a raw JSON object (not SSE), it might look like:
                    // { "selected_agent": "...", "response": "..." }
                    // We detect this if the line starts with '{' and ends with '}'
                    else if (trimmed.startsWith("{")) {
                        try {
                            const data = JSON.parse(trimmed);
                            if (data.response) {
                                // Replace content with the full response
                                // Since we might have streamed partials? 
                                // Actually, if we get this, it's likely the *only* response.
                                // We should overwrite the placeholder.
                                // But `updateLastMessage` appends. 
                                // For this specific edge case, if content was empty, we append.
                                // If content was partial, we might need a "setLastMessage" action, but append works if we assume mostly distinct modes.
                                // Let's just append the delta if it's new, OR if it's the full text:

                                // Heuristic: If this is a full object, updateLastMessage might duplicate if we already streamed.
                                // But "Raw JSON" usually implies NO streaming preceded it.
                                updateLastMessage(data.response);
                            }
                        } catch (e) {
                            // Just text?
                            updateLastMessage(trimmed);
                        }
                    }
                    // CASE 3: Plain Text
                    else {
                        updateLastMessage(trimmed);
                    }

                    isFirstChunk = false;
                }
            }

            // 4. Update Session List if New Session
            const currentSessions = sessionStore.getState().sessions;
            const sessionExists = currentSessions.some(s => s.session_id === sessionId);
            if (!sessionExists) {
                fetchSessions().then(data => sessionStore.getState().setSessions(data.sessions));
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error("Failed to send message:", error);
                // Only add error message if we haven't received anything?
                // Or append error.
                updateLastMessage("\n[Error: Connection failed. Please try again.]");
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [sessionId, addMessage, updateLastMessage, isLoading, token]);

    return {
        messages,
        sendMessage,
        isLoading,
    };
}
