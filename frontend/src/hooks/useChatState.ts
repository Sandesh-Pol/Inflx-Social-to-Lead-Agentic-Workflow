import { useState, useCallback, useMemo } from 'react';
import { ChatState, Message, IntentLevel, Session, LeadInfo } from '@/types/chat';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createNewSession = (): Session => ({
  id: generateId(),
  title: `Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  messages: [],
  leadInfo: { name: null, email: null, platform: null },
  intentLevel: 'exploring',
  selectedPlan: null,
  youtubeLink: null,
  showYouTubeAnalysis: false,
  currentQuestion: null,
  isSubmitted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const initialSession = createNewSession();

const initialState: ChatState = {
  sessions: [initialSession],
  activeSessionId: initialSession.id,
  isTyping: false,
};

// Map backend intent to frontend intent level
const mapIntentToLevel = (intent: string): IntentLevel => {
  switch (intent) {
    case 'greeting':
      return 'exploring';
    case 'product_pricing':
      return 'interested';
    case 'high_intent':
      return 'high-intent';
    default:
      return 'exploring';
  }
};

export function useChatState() {
  const [state, setState] = useState<ChatState>(initialState);

  // Get the active session
  const activeSession = useMemo(() => {
    return state.sessions.find(s => s.id === state.activeSessionId) || state.sessions[0];
  }, [state.sessions, state.activeSessionId]);

  // Update the active session
  const updateActiveSession = useCallback((updates: Partial<Session>) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.id === prev.activeSessionId
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      ),
    }));
  }, []);

  const addMessage = useCallback((sender: 'ai' | 'user', content: string, type: Message['type'] = 'text') => {
    const message: Message = {
      id: generateId(),
      type,
      sender,
      content,
      timestamp: new Date(),
    };
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.id === prev.activeSessionId
          ? {
            ...session,
            messages: [...session.messages, message],
            updatedAt: new Date(),
            // Update title based on first user message
            title: session.messages.length === 0 && sender === 'user'
              ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
              : session.title
          }
          : session
      ),
    }));
    return message;
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  }, []);

  const setIntent = useCallback((intentLevel: IntentLevel) => {
    updateActiveSession({ intentLevel });
  }, [updateActiveSession]);

  const updateLead = useCallback((field: keyof LeadInfo, value: string) => {
    setState(prev => {
      const activeSession = prev.sessions.find(s => s.id === prev.activeSessionId);
      if (!activeSession) return prev;

      return {
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === prev.activeSessionId
            ? {
              ...session,
              leadInfo: { ...session.leadInfo, [field]: value },
              updatedAt: new Date(),
            }
            : session
        ),
      };
    });
  }, []);

  const setCurrentQuestion = useCallback((question: Session['currentQuestion']) => {
    updateActiveSession({ currentQuestion: question });
  }, [updateActiveSession]);

  const setSubmitted = useCallback((isSubmitted: boolean) => {
    updateActiveSession({ isSubmitted });
  }, [updateActiveSession]);

  const setSelectedPlan = useCallback((plan: 'basic' | 'pro' | null) => {
    updateActiveSession({ selectedPlan: plan });
  }, [updateActiveSession]);

  const setYouTubeLink = useCallback((link: string | null) => {
    updateActiveSession({ youtubeLink: link });
  }, [updateActiveSession]);

  const setShowYouTubeAnalysis = useCallback((show: boolean) => {
    updateActiveSession({ showYouTubeAnalysis: show });
  }, [updateActiveSession]);

  const simulateResponse = useCallback((callback: () => void, delay = 1000) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      callback();
    }, delay);
  }, [setTyping]);

  /**
   * NEW: Send message to backend API
   */
  const sendMessageToBackend = useCallback(async (message: string) => {
    try {
      setTyping(true);

      // Call backend API
      const response = await api.sendMessage(activeSession.id, message);

      setTyping(false);

      // Add AI response to messages
      addMessage('ai', response.reply);

      // Update session state based on backend response
      const intentLevel = mapIntentToLevel(response.intent);

      updateActiveSession({
        intentLevel,
        selectedPlan: response.state.selected_plan as 'basic' | 'pro' | null,
        leadInfo: {
          name: response.state.name,
          email: response.state.email,
          platform: response.state.platform,
        },
        youtubeLink: response.state.yt_channel,
        isSubmitted: response.state.lead_captured,
      });

      // Show success toast if lead was captured
      if (response.state.lead_captured && !activeSession.isSubmitted) {
        toast.success('Lead captured successfully! 🎉');
      }

      return response;
    } catch (error) {
      setTyping(false);
      console.error('Error sending message to backend:', error);

      // Show error toast
      toast.error('Failed to send message. Please try again.');

      // Fallback to simulated response
      simulateResponse(() => {
        addMessage('ai', "I'm having trouble connecting to the server. Please check your connection and try again.");
      }, 500);

      throw error;
    }
  }, [activeSession.id, activeSession.isSubmitted, addMessage, setTyping, updateActiveSession, simulateResponse]);

  // Session management
  const createSession = useCallback(() => {
    const newSession = createNewSession();
    setState(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      activeSessionId: newSession.id,
    }));
    return newSession;
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setState(prev => ({
      ...prev,
      activeSessionId: sessionId,
    }));
  }, []);

  return {
    state,
    activeSession,
    addMessage,
    setTyping,
    setIntent,
    updateLead,
    setCurrentQuestion,
    setSubmitted,
    setSelectedPlan,
    setYouTubeLink,
    setShowYouTubeAnalysis,
    simulateResponse,
    sendMessageToBackend, // NEW: Expose backend integration
    createSession,
    selectSession,
  };
}
