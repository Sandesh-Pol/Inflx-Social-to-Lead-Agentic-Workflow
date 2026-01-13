import { IntentLevel } from '@/types/chat';

interface ChatHeaderProps {
  intentLevel: IntentLevel;
}

const intentConfig = {
  'exploring': {
    label: 'Exploring',
    emoji: '🟢',
    bgClass: 'bg-intent-exploring/10',
    textClass: 'text-intent-exploring',
  },
  'interested': {
    label: 'Interested',
    emoji: '🟡',
    bgClass: 'bg-intent-interested/10',
    textClass: 'text-intent-interested',
  },
  'high-intent': {
    label: 'High Intent',
    emoji: '🔥',
    bgClass: 'bg-intent-high/10',
    textClass: 'text-intent-high',
  },
};

export function ChatHeader({ intentLevel }: ChatHeaderProps) {
  const config = intentConfig[intentLevel];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-foreground">
          AutoStream AI Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Helping creators edit smarter
        </p>
      </div>
      
      <div 
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          ${config.bgClass} intent-pulse transition-all duration-300
        `}
      >
        <span className="text-sm">{config.emoji}</span>
        <span className={`text-sm font-medium ${config.textClass}`}>
          {config.label}
        </span>
      </div>
    </header>
  );
}
