"use client";

import { Session } from "@/types";
import { SessionItem } from "./SessionItem";

interface SessionListProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSessionClick: (sessionId: string) => void;
}

/**
 * Groups sessions by date and renders them
 */
export function SessionList({
  sessions,
  currentSessionId,
  onSessionClick,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Chưa có cuộc trò chuyện nào
      </div>
    );
  }

  // Group sessions by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todaySessions: Session[] = [];
  const yesterdaySessions: Session[] = [];
  const olderSessions: Session[] = [];

  sessions.forEach((session) => {
    const sessionDate = new Date(session.last_updated);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === today.getTime()) {
      todaySessions.push(session);
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      yesterdaySessions.push(session);
    } else {
      olderSessions.push(session);
    }
  });

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="space-y-4 p-2">
      {todaySessions.length > 0 && (
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
            HÔM NAY
          </h3>
          <div className="space-y-1">
            {todaySessions.map((session) => (
              <SessionItem
                key={session.session_id}
                session={session}
                isActive={session.session_id === currentSessionId}
                timeAgo={formatTimeAgo(session.last_updated)}
                onClick={() => onSessionClick(session.session_id)}
              />
            ))}
          </div>
        </div>
      )}

      {yesterdaySessions.length > 0 && (
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
            HÔM QUA
          </h3>
          <div className="space-y-1">
            {yesterdaySessions.map((session) => (
              <SessionItem
                key={session.session_id}
                session={session}
                isActive={session.session_id === currentSessionId}
                timeAgo={formatTimeAgo(session.last_updated)}
                onClick={() => onSessionClick(session.session_id)}
              />
            ))}
          </div>
        </div>
      )}

      {olderSessions.length > 0 && (
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
            TRƯỚC ĐÓ
          </h3>
          <div className="space-y-1">
            {olderSessions.map((session) => (
              <SessionItem
                key={session.session_id}
                session={session}
                isActive={session.session_id === currentSessionId}
                timeAgo={formatTimeAgo(session.last_updated)}
                onClick={() => onSessionClick(session.session_id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

