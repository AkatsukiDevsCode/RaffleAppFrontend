import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "src/shared/core/utils/cn.util";

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
    isAccent?: boolean;
}

function StatCard({ label, value, change, icon: Icon, isAccent = false }: StatCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-secondary/50",
                isAccent ? "border-primary/50 bg-primary/10" : "border-border/70 bg-card/70",
            )}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-secondary">
                    <Icon className="size-4" />
                </span>
            </div>
            <div className="mt-5 flex items-end justify-between">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
                    <ArrowUpRight className="size-3" />
                    {change}
                </span>
            </div>
        </div>
    );
}

export { StatCard };
