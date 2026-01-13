import { LeadInfo } from '@/types/chat';
import { Check, Clock, User, Mail, Video } from 'lucide-react';

interface LeadProgressPanelProps {
  leadInfo: LeadInfo;
}

interface ProgressItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  isComplete: boolean;
}

function ProgressItem({ icon, label, value, isComplete }: ProgressItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div 
        className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300
          ${isComplete ? 'bg-success/10' : 'bg-muted'}
        `}
      >
        {isComplete ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <Clock className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value && (
          <p className="text-xs text-muted-foreground truncate">{value}</p>
        )}
      </div>
      
      <div className="text-muted-foreground">
        {icon}
      </div>
    </div>
  );
}

export function LeadProgressPanel({ leadInfo }: LeadProgressPanelProps) {
  const completedCount = [leadInfo.name, leadInfo.email, leadInfo.platform].filter(Boolean).length;
  const progressPercent = (completedCount / 3) * 100;

  return (
    <div className="glass-panel rounded-xl p-5 shadow-panel h-fit">
      <h2 className="text-sm font-semibold text-foreground mb-1">
        Lead Information
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        {completedCount}/3 fields completed
      </p>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      <div className="space-y-0">
        <ProgressItem
          icon={<User className="w-4 h-4" />}
          label="Name"
          value={leadInfo.name}
          isComplete={!!leadInfo.name}
        />
        <ProgressItem
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          value={leadInfo.email}
          isComplete={!!leadInfo.email}
        />
        <ProgressItem
          icon={<Video className="w-4 h-4" />}
          label="Creator Platform"
          value={leadInfo.platform}
          isComplete={!!leadInfo.platform}
        />
      </div>
    </div>
  );
}
