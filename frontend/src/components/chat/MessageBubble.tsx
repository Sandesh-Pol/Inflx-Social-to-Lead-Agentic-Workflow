import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.sender === 'ai';

  return (
    <div 
      className={`
        flex flex-col gap-1 message-enter
        ${isAI ? 'items-start' : 'items-end'}
      `}
    >
      {isAI && (
        <span className="text-xs text-muted-foreground ml-1">
          AutoStream Assistant
        </span>
      )}
      
      <div
        className={`
          max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-message
          ${isAI 
            ? 'bg-message-ai text-message-ai-foreground rounded-tl-md' 
            : 'bg-message-user text-message-user-foreground rounded-tr-md'
          }
        `}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}
