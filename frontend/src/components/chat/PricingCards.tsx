import { Check } from 'lucide-react';

interface PricingCardsProps {
  onSelectPlan: (plan: 'basic' | 'pro') => void;
}

export function PricingCards({ onSelectPlan }: PricingCardsProps) {
  return (
    <div className="flex flex-col gap-1 items-start message-enter w-full">
      <span className="text-xs text-muted-foreground ml-1">
        AutoStream Assistant
      </span>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Basic Plan */}
        <div 
          onClick={() => onSelectPlan('basic')}
          className="
            bg-card border border-border rounded-xl p-5 
            cursor-pointer transition-all duration-200
            hover:border-primary/30 hover:shadow-panel
          "
        >
          <h3 className="text-lg font-semibold text-foreground">Basic</h3>
          <div className="mt-2 mb-4">
            <span className="text-2xl font-bold text-foreground">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-intent-exploring" />
              10 videos/month
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-intent-exploring" />
              720p resolution
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div 
          onClick={() => onSelectPlan('pro')}
          className="
            bg-card border-2 border-primary rounded-xl p-5 
            cursor-pointer transition-all duration-200
            hover:shadow-panel-lg pro-glow relative overflow-hidden
          "
        >
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            Popular
          </div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-1">
            Pro <span>⭐</span>
          </h3>
          <div className="mt-2 mb-4">
            <span className="text-2xl font-bold text-foreground">$79</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              Unlimited videos
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              4K resolution
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              AI captions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
