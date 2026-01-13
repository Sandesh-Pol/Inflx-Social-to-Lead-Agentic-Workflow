import { LeadInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';

interface ConfirmationCardProps {
  leadInfo: LeadInfo;
  onConfirm: () => void;
}

export function ConfirmationCard({ leadInfo, onConfirm }: ConfirmationCardProps) {
  return (
    <div className="flex flex-col gap-1 items-start message-enter w-full">
      <span className="text-xs text-muted-foreground ml-1">
        AutoStream Assistant
      </span>
      
      <div className="bg-card border border-border rounded-xl p-5 w-full max-w-md shadow-panel">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Please confirm your details:
        </h3>
        
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium text-foreground">{leadInfo.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">{leadInfo.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Platform</span>
            <span className="text-sm font-medium text-foreground">{leadInfo.platform}</span>
          </div>
        </div>
        
        <Button 
          onClick={onConfirm}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Confirm & Submit
        </Button>
      </div>
    </div>
  );
}
