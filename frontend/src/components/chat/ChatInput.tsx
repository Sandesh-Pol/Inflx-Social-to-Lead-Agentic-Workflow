import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickReplies } from './QuickReplies';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  showQuickReplies?: boolean;
}

export function ChatInput({ onSend, disabled, showQuickReplies = true }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleQuickReply = (message: string) => {
    if (!disabled) {
      onSend(message);
    }
  };

  return (
    <footer className="bg-card border-t border-border p-4 space-y-3">
      {showQuickReplies && (
        <QuickReplies onSelect={handleQuickReply} />
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about pricing, features, or plans…"
          disabled={disabled}
          className="
            flex-1 px-4 py-3 rounded-xl
            bg-muted text-foreground placeholder:text-muted-foreground
            border border-transparent
            focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
        
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </footer>
  );
}
