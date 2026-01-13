/**
 * AutoStream API Client
 * Handles all communication with FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
    session_id: string;
    message: string;
}

export interface ChatResponse {
    reply: string;
    intent: 'greeting' | 'product_pricing' | 'high_intent';
    state: {
        selected_plan: string | null;
        name: string | null;
        email: string | null;
        platform: string | null;
        yt_channel: string | null;
        lead_captured: boolean;
        turn_count: number;
    };
    ui_components?: {
        show_pricing_cards?: boolean;
        show_plan_comparison?: boolean;
        show_youtube_permission?: boolean;
        youtube_channel?: string;
        show_confirmation?: boolean;
        show_success?: boolean;
    };
}

export interface SessionState {
    session_id: string;
    intent: string;
    selected_plan: string | null;
    name: string | null;
    email: string | null;
    platform: string | null;
    lead_captured: boolean;
    turn_count: number;
    message_count: number;
}

export interface ApiError {
    detail: string;
}

class AutoStreamAPI {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Send a chat message to the backend
     */
    async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: message,
                }),
            });

            if (!response.ok) {
                const error: ApiError = await response.json();
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            const data: ChatResponse = await response.json();
            return data;
        } catch (error) {
            console.error('API Error (sendMessage):', error);
            throw error;
        }
    }

    /**
     * Get session state from backend
     */
    async getSession(sessionId: string): Promise<SessionState> {
        try {
            const response = await fetch(`${this.baseUrl}/api/session/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Session not found or expired');
                }
                const error: ApiError = await response.json();
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            const data: SessionState = await response.json();
            return data;
        } catch (error) {
            console.error('API Error (getSession):', error);
            throw error;
        }
    }

    /**
     * Delete a session from backend
     */
    async deleteSession(sessionId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/session/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error: ApiError = await response.json();
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('API Error (deleteSession):', error);
            throw error;
        }
    }

    /**
     * Get session statistics
     */
    async getStats(): Promise<{
        total_sessions: number;
        max_sessions: number;
        oldest_session: string | null;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error: ApiError = await response.json();
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (getStats):', error);
            throw error;
        }
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error (healthCheck):', error);
            throw error;
        }
    }
}

// Export singleton instance
export const api = new AutoStreamAPI();

// Export class for testing
export { AutoStreamAPI };
