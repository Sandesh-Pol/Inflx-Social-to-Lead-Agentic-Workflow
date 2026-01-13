import { Youtube, Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeStrategyCardProps {
    channelUrl?: string;
    onAcceptAnalysis?: () => void;
    onDeclineAnalysis?: () => void;
    showPermissionRequest?: boolean;
}

export function YouTubeStrategyCard({
    channelUrl,
    onAcceptAnalysis,
    onDeclineAnalysis,
    showPermissionRequest = true,
}: YouTubeStrategyCardProps) {

    // Permission Request View
    if (showPermissionRequest) {
        return (
            <div className="flex flex-col gap-1 items-start message-enter w-full">
                <span className="text-xs text-muted-foreground ml-1">
                    AutoStream Assistant
                </span>

                <div className="bg-card border border-primary/30 rounded-xl p-5 max-w-md w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Youtube className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="font-semibold text-foreground">YouTube Channel Detected</h3>
                    </div>

                    {channelUrl && (
                        <p className="text-xs text-muted-foreground mb-4 break-all">
                            {channelUrl}
                        </p>
                    )}

                    <p className="text-sm text-foreground mb-4">
                        Would you like personalized Pro recommendations for your channel?
                    </p>

                    <div className="flex gap-2">
                        <Button
                            onClick={onAcceptAnalysis}
                            size="sm"
                            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Check className="w-4 h-4" />
                            Yes please
                        </Button>
                        <Button
                            onClick={onDeclineAnalysis}
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                        >
                            <X className="w-4 h-4" />
                            No thanks
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Pro Benefits Table View
    return (
        <div className="flex flex-col gap-1 items-start message-enter w-full">
            <span className="text-xs text-muted-foreground ml-1">
                AutoStream Assistant
            </span>

            <div className="bg-card border border-border rounded-xl p-5 max-w-lg w-full">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Pro Benefits for YouTubers</h3>
                </div>

                {/* Comparison Table */}
                <div className="rounded-lg border border-border overflow-hidden mb-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="text-left p-3 font-medium text-foreground">Feature</th>
                                <th className="text-center p-3 font-medium text-muted-foreground">Basic</th>
                                <th className="text-center p-3 font-medium text-primary">Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">Resolution</td>
                                <td className="p-3 text-center text-muted-foreground">720p</td>
                                <td className="p-3 text-center text-primary font-medium">4K</td>
                            </tr>
                            <tr className="border-t border-border bg-muted/20">
                                <td className="p-3 text-foreground">Videos/month</td>
                                <td className="p-3 text-center text-muted-foreground">10</td>
                                <td className="p-3 text-center text-primary font-medium">Unlimited</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">AI Captions</td>
                                <td className="p-3 text-center text-muted-foreground">
                                    <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                                </td>
                                <td className="p-3 text-center text-primary">
                                    <Check className="w-4 h-4 mx-auto" />
                                </td>
                            </tr>
                            <tr className="border-t border-border bg-muted/20">
                                <td className="p-3 text-foreground">SEO Boost</td>
                                <td className="p-3 text-center text-muted-foreground">
                                    <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                                </td>
                                <td className="p-3 text-center text-primary">
                                    <Check className="w-4 h-4 mx-auto" />
                                </td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">Priority Support</td>
                                <td className="p-3 text-center text-muted-foreground">
                                    <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                                </td>
                                <td className="p-3 text-center text-primary">
                                    <Check className="w-4 h-4 mx-auto" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-primary">
                        Pro helps YouTube channels grow with better discoverability
                    </p>
                </div>
            </div>
        </div>
    );
}
