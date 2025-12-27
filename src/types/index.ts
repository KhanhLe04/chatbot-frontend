// User Types
export interface User {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
}

// Authentication Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Session Types
export interface Session {
  session_id: string;
  title: string;
  last_updated: string;
}

export interface SessionsResponse {
  sessions: Session[];
}

// Message Types
export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  selected_agent: string;
  response: string;
  sources: string[] | null;
  error: string | null;
}

// History Types
export interface HistoryResponse {
  messages: Message[];
  created_at: string;
  last_updated: string;
}

// Delete Response Types
export interface DeleteUserResponse {
  status: string;
  message: string;
}

export interface DeleteSessionResponse {
  status: string;
  message: string;
  postgres_deleted: boolean;
}

// Ingestion Types
export interface IngestResponse {
  status: string;
  message: string;
}

// Health Check Types
export interface HealthCheckResponse {
  status: string;
  redis: {
    connected: boolean;
  };
  postgres: {
    connected: boolean;
  };
  agent: Record<string, unknown>;
  ingestion: Record<string, unknown>;
}

