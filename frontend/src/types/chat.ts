export type IntentLevel = 'exploring' | 'interested' | 'high-intent';

export type MessageType = 'text' | 'pricing' | 'confirmation' | 'success';

export interface Message {
  id: string;
  type: MessageType;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface LeadInfo {
  name: string | null;
  email: string | null;
  platform: string | null;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  leadInfo: LeadInfo;
  intentLevel: IntentLevel;
  selectedPlan: 'basic' | 'pro' | null;
  youtubeLink: string | null;
  showYouTubeAnalysis: boolean;
  currentQuestion: 'name' | 'email' | 'platform' | 'confirm' | 'complete' | null;
  isSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  sessions: Session[];
  activeSessionId: string;
  isTyping: boolean;
}
