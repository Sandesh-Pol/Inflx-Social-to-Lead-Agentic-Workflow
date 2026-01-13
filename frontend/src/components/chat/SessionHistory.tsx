import { Session } from '@/types/chat';
import { History, Plus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface SessionHistoryProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
}

export function SessionHistory({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onCreateSession 
}: SessionHistoryProps) {
  
  const getSessionPreview = (session: Session) => {
    if (session.messages.length === 0) return 'New conversation';
    const lastMessage = session.messages[session.messages.length - 1];
    const content = lastMessage.content;
    if (content.length <= 40) return content;
    return content.substring(0, 37) + '...';
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Session History
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateSession}
          className="h-7 w-7 p-0 hover:bg-primary/10"
        >
          <Plus className="w-4 h-4 text-primary" />
        </Button>
      </div>
      
      {sessions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground italic">
            No sessions yet
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 chat-scroll">
          {sortedSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`
                w-full text-left p-3 rounded-lg transition-all
                ${session.id === activeSessionId 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted/50 hover:bg-muted/80'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <MessageCircle className={`
                  w-3.5 h-3.5 mt-0.5 flex-shrink-0
                  ${session.id === activeSessionId ? 'text-primary' : 'text-muted-foreground'}
                `} />
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-xs font-medium truncate
                    ${session.id === activeSessionId ? 'text-primary' : 'text-foreground'}
                  `}>
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {getSessionPreview(session)}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {format(new Date(session.updatedAt), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
              
              {session.id === activeSessionId && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-success font-medium">Active</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
