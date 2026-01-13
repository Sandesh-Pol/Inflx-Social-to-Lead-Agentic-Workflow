import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanComparisonTableProps {
    selectedPlan?: 'basic' | 'pro' | null;
    onSwitchToPro?: () => void;
}

export function PlanComparisonTable({ selectedPlan, onSwitchToPro }: PlanComparisonTableProps) {
    return (
        <div className="flex flex-col gap-1 items-start message-enter w-full">
            <span className="text-xs text-muted-foreground ml-1">
                AutoStream Assistant
            </span>

            <div className="bg-card border border-border rounded-xl p-5 max-w-lg w-full">
                <h3 className="font-semibold text-foreground mb-4">Plan Comparison</h3>

                {/* Comparison Table */}
                <div className="rounded-lg border border-border overflow-hidden mb-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="text-left p-3 font-medium text-foreground">Feature</th>
                                <th className="text-center p-3 font-medium">
                                    <span className={selectedPlan === 'basic' ? 'text-primary' : 'text-muted-foreground'}>
                                        Basic
                                    </span>
                                    {selectedPlan === 'basic' && (
                                        <span className="block text-[10px] text-primary">Selected</span>
                                    )}
                                </th>
                                <th className="text-center p-3 font-medium">
                                    <span className={selectedPlan === 'pro' ? 'text-primary' : 'text-muted-foreground'}>
                                        Pro
                                    </span>
                                    {selectedPlan === 'pro' && (
                                        <span className="block text-[10px] text-primary">Selected</span>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">Price</td>
                                <td className="p-3 text-center font-semibold text-foreground">$29/mo</td>
                                <td className="p-3 text-center font-semibold text-primary">$79/mo</td>
                            </tr>
                            <tr className="border-t border-border bg-muted/20">
                                <td className="p-3 text-foreground">Videos</td>
                                <td className="p-3 text-center text-muted-foreground">10/month</td>
                                <td className="p-3 text-center text-primary font-medium">Unlimited</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">Resolution</td>
                                <td className="p-3 text-center text-muted-foreground">720p</td>
                                <td className="p-3 text-center text-primary font-medium">4K</td>
                            </tr>
                            <tr className="border-t border-border bg-muted/20">
                                <td className="p-3 text-foreground">AI Captions</td>
                                <td className="p-3 text-center">
                                    <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                                </td>
                                <td className="p-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-primary" />
                                </td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-3 text-foreground">24/7 Support</td>
                                <td className="p-3 text-center">
                                    <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                                </td>
                                <td className="p-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-primary" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {selectedPlan === 'basic' && onSwitchToPro && (
                    <Button
                        onClick={onSwitchToPro}
                        size="sm"
                        className="w-full gap-2 bg-primary hover:bg-primary/90"
                    >
                        Switch to Pro
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
