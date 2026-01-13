import { Check, Sparkles, Zap, Video, Monitor, Subtitles, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InformationPanelProps {
  selectedPlan: 'basic' | 'pro' | null;
  onSwitchToPro?: () => void;
  youtubeLink?: string | null;
  showYouTubeAnalysis?: boolean;
}

export function InformationPanel({ 
  selectedPlan, 
  onSwitchToPro,
  youtubeLink,
  showYouTubeAnalysis 
}: InformationPanelProps) {
  
  // Show YouTube analysis benefits if link was shared
  if (showYouTubeAnalysis && youtubeLink) {
    return (
      <div className="glass-panel rounded-xl p-5 h-full overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Ideal for Your YouTube Channel
          </h2>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          Based on your channel, Pro would help you:
        </p>
        
        <div className="space-y-3">
          <BenefitItem
            icon={<Monitor className="w-4 h-4" />}
            title="4K Quality"
            description="Professional resolution that YouTube recommends"
          />
          <BenefitItem
            icon={<Subtitles className="w-4 h-4" />}
            title="AI Captions"
            description="Auto-generated captions boost SEO & accessibility"
          />
          <BenefitItem
            icon={<Video className="w-4 h-4" />}
            title="Unlimited Videos"
            description="Scale your content without limits"
          />
          <BenefitItem
            icon={<TrendingUp className="w-4 h-4" />}
            title="Growth Ready"
            description="Built for channels that want to scale"
          />
        </div>
      </div>
    );
  }
  
  // Show Basic plan with comparison when Basic is selected
  if (selectedPlan === 'basic') {
    return (
      <div className="glass-panel rounded-xl p-5 h-full overflow-auto">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Plan Comparison
        </h2>
        
        <div className="space-y-4">
          {/* Basic Plan - Selected */}
          <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">Basic</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Selected
              </span>
            </div>
            <p className="text-lg font-bold text-foreground mb-3">
              $29<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-intent-exploring" />
                10 videos/month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-intent-exploring" />
                720p resolution
              </li>
            </ul>
          </div>
          
          {/* Pro Plan - Upgrade option */}
          <div className="border border-border rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="text-[10px] bg-intent-interested/10 text-intent-interested px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <h3 className="font-medium text-foreground flex items-center gap-1 mb-2">
              Pro <Sparkles className="w-3.5 h-3.5 text-primary" />
            </h3>
            <p className="text-lg font-bold text-foreground mb-3">
              $79<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground mb-4">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                Unlimited videos
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                4K resolution
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                AI captions
              </li>
            </ul>
            
            <Button 
              onClick={onSwitchToPro}
              size="sm"
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              Switch to Pro
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show Pro plan benefits when Pro is selected (no comparison)
  if (selectedPlan === 'pro') {
    return (
      <div className="glass-panel rounded-xl p-5 h-full overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Pro Plan Benefits
          </h2>
        </div>
        
        <div className="space-y-4">
          <BenefitItem
            icon={<Video className="w-4 h-4" />}
            title="Unlimited Exports"
            description="Create as many videos as you need, no monthly limits"
          />
          <BenefitItem
            icon={<Monitor className="w-4 h-4" />}
            title="4K Resolution"
            description="Crystal clear quality for professional content"
          />
          <BenefitItem
            icon={<Subtitles className="w-4 h-4" />}
            title="AI Captions"
            description="Automatic captions with 99% accuracy"
          />
          <BenefitItem
            icon={<TrendingUp className="w-4 h-4" />}
            title="Built for Scaling"
            description="Enterprise-ready infrastructure that grows with you"
          />
        </div>
        
        <div className="mt-5 pt-4 border-t border-border">
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-success font-medium flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              You've chosen the best plan for serious creators
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Default state - no plan selected
  return (
    <div className="glass-panel rounded-xl p-5 h-full flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Sparkles className="w-6 h-6 text-muted-foreground" />
      </div>
      <h2 className="text-sm font-semibold text-foreground mb-1">
        Plan Information
      </h2>
      <p className="text-xs text-muted-foreground">
        Select a plan to see details and benefits
      </p>
    </div>
  );
}

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
