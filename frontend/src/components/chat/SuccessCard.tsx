import { PartyPopper } from 'lucide-react';

export function SuccessCard() {
  return (
    <div className="flex flex-col gap-1 items-start message-enter w-full">
      <span className="text-xs text-muted-foreground ml-1">
        AutoStream Assistant
      </span>
      
      <div className="bg-success/5 border border-success/20 rounded-xl p-6 w-full max-w-md shadow-panel success-bounce">
        <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4 mx-auto">
          <PartyPopper className="w-6 h-6 text-success" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground text-center mb-2">
          🎉 You're all set!
        </h3>
        
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          Our team will contact you shortly.
          <br />
          Thanks for choosing AutoStream!
        </p>
      </div>
    </div>
  );
}
