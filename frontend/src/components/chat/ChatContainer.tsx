import { useEffect, useRef, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { PricingCards } from './PricingCards';
import { ConfirmationCard } from './ConfirmationCard';
import { SuccessCard } from './SuccessCard';
import { LeadProgressPanel } from './LeadProgressPanel';
import { SessionHistory } from './SessionHistory';
import { InformationPanel } from './InformationPanel';
import { useChatState } from '@/hooks/useChatState';
import { ChevronUp, ChevronDown, History, Info } from 'lucide-react';

export function ChatContainer() {
  const {
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
    sendMessageToBackend,
    createSession,
    selectSession,
  } = useChatState();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showYTPermission, setShowYTPermission] = useState(false);
  const [showYTStrategy, setShowYTStrategy] = useState(false);
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [detectedYTChannel, setDetectedYTChannel] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession.messages, state.isTyping, showPricing, showConfirmation, showSuccess]);

  // Initial greeting for new sessions
  useEffect(() => {
    if (!hasInitialized.has(activeSession.id) && activeSession.messages.length === 0) {
      setHasInitialized(prev => new Set(prev).add(activeSession.id));

      // Send initial greeting to backend to start conversation
      const initializeConversation = async () => {
        try {
          await sendMessageToBackend("Hi");
        } catch (error) {
          // Fallback to local greeting if backend fails
          simulateResponse(() => {
            addMessage('ai', "Hi there! 👋 I'm the AutoStream AI Assistant. I help video creators find the perfect editing plan.\n\nWhat would you like to know about our video editing services?");
          }, 800);
        }
      };

      initializeConversation();
    }
  }, [activeSession.id, activeSession.messages.length, hasInitialized, sendMessageToBackend, simulateResponse, addMessage]);

  // Reset UI state when switching sessions
  useEffect(() => {
    setShowPricing(false);
    setShowConfirmation(false);
    setShowSuccess(activeSession.isSubmitted);
  }, [activeSession.id, activeSession.isSubmitted]);

  const handleCreateNewSession = () => {
    createSession();
    setShowPricing(false);
    setShowConfirmation(false);
    setShowSuccess(false);
  };

  const handleUserMessage = async (content: string) => {
    // Add user message to UI immediately
    addMessage('user', content);

    try {
      // Send to backend and get AI response
      const response = await sendMessageToBackend(content);

      // Use ui_components from backend response
      const uiComponents = response.ui_components || {};

      // Show pricing cards if backend says so
      if (uiComponents.show_pricing_cards) {
        setTimeout(() => setShowPricing(true), 300);
      }

      // Show plan comparison if backend says so
      if (uiComponents.show_plan_comparison) {
        setTimeout(() => setShowPlanComparison(true), 300);
      }

      // Show YouTube permission if backend detected channel
      if (uiComponents.show_youtube_permission) {
        setDetectedYTChannel(uiComponents.youtube_channel || null);
        setTimeout(() => setShowYTPermission(true), 500);
      }

      // Show confirmation if backend says so
      if (uiComponents.show_confirmation) {
        setTimeout(() => {
          setShowConfirmation(true);
          setCurrentQuestion('confirm');
        }, 300);
      }

      // Show success if backend says so
      if (uiComponents.show_success) {
        setShowConfirmation(false);
        setShowSuccess(true);
        setCurrentQuestion('complete');
      }

    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectPlan = async (plan: 'basic' | 'pro') => {
    setShowPricing(false);
    const planName = plan === 'pro' ? 'Pro' : 'Basic';

    // Send plan selection to backend
    await handleUserMessage(`I'm interested in the ${planName} plan`);
  };

  const handleSwitchToPro = async () => {
    // Send switch request to backend
    await handleUserMessage("I'd like to switch to Pro plan");
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setSubmitted(true);
    setCurrentQuestion('complete');
    simulateResponse(() => {
      setShowSuccess(true);
    }, 800);
  };

  // YouTube permission handlers
  const handleAcceptYTAnalysis = () => {
    setShowYTPermission(false);
    setShowYTStrategy(true);
    setShowYouTubeAnalysis(true);
  };

  const handleDeclineYTAnalysis = () => {
    setShowYTPermission(false);
    setDetectedYTChannel(null);
  };

  const handleSwitchFromComparison = async () => {
    setShowPlanComparison(false);
    await handleUserMessage("I'd like to switch to Pro plan");
  };

  const isInputDisabled = state.isTyping || activeSession.isSubmitted;
  const showQuickReplies = activeSession.messages.length <= 1 && !state.isTyping;

  return (
    <div className="flex h-screen bg-chat-bg">
      {/* Left Column - Desktop */}
      <div className="hidden lg:flex flex-col w-72 border-r border-border bg-card">
        {/* Session History - Top */}
        <div className="flex-1 p-4 overflow-hidden">
          <SessionHistory
            sessions={state.sessions}
            activeSessionId={state.activeSessionId}
            onSelectSession={selectSession}
            onCreateSession={handleCreateNewSession}
          />
        </div>

        {/* Lead Info - Bottom */}
        <div className="p-4 border-t border-border">
          <LeadProgressPanel leadInfo={activeSession.leadInfo} />
        </div>
      </div>

      {/* Center Column - Chat */}
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader intentLevel={activeSession.intentLevel} />

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 chat-scroll"
        >
          {activeSession.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {state.isTyping && <TypingIndicator />}

          {showPricing && <PricingCards onSelectPlan={handleSelectPlan} />}

          {showConfirmation && (
            <ConfirmationCard
              leadInfo={activeSession.leadInfo}
              onConfirm={handleConfirm}
            />
          )}

          {showSuccess && <SuccessCard />}
        </div>

        <ChatInput
          onSend={handleUserMessage}
          disabled={isInputDisabled}
          showQuickReplies={showQuickReplies}
        />
      </div>

      {/* Right Column - Desktop */}
      <div className="hidden lg:block w-80 border-l border-border bg-card p-4">
        <InformationPanel
          selectedPlan={activeSession.selectedPlan}
          onSwitchToPro={handleSwitchToPro}
          youtubeLink={activeSession.youtubeLink}
          showYouTubeAnalysis={activeSession.showYouTubeAnalysis}
        />
      </div>

      {/* Mobile Bottom Panels */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10">
        <div className="flex bg-card border-t border-border">
          <button
            onClick={() => {
              setLeftPanelOpen(!leftPanelOpen);
              setRightPanelOpen(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground border-r border-border"
          >
            <History className="w-4 h-4" />
            Sessions
            {leftPanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setRightPanelOpen(!rightPanelOpen);
              setLeftPanelOpen(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground"
          >
            <Info className="w-4 h-4" />
            Plan Info
            {rightPanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {leftPanelOpen && (
          <div className="bg-card border-t border-border p-4 max-h-72 overflow-y-auto space-y-4">
            <SessionHistory
              sessions={state.sessions}
              activeSessionId={state.activeSessionId}
              onSelectSession={selectSession}
              onCreateSession={handleCreateNewSession}
            />
            <LeadProgressPanel leadInfo={activeSession.leadInfo} />
          </div>
        )}

        {rightPanelOpen && (
          <div className="bg-card border-t border-border p-4 max-h-72 overflow-y-auto">
            <InformationPanel
              selectedPlan={activeSession.selectedPlan}
              onSwitchToPro={handleSwitchToPro}
              youtubeLink={activeSession.youtubeLink}
              showYouTubeAnalysis={activeSession.showYouTubeAnalysis}
            />
          </div>
        )}
      </div>
    </div>
  );
}
