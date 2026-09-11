import { Gift } from "lucide-react";

import { type Raffle } from "src/features/raffles/core/domain/raffle.interface";

import { RaffleStatusBadge } from "src/features/raffles/presentation/components/cards/raffle-status-badge";

interface RaffleCardProps {
    raffle: Raffle;
}

function RaffleCard({ raffle }: RaffleCardProps) {
    return (
        <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-secondary">
                        <Gift className="size-4" />
                    </span>
                    <div>
                        <p className="font-semibold">{raffle.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{raffle.category}</p>
                    </div>
                </div>
                <RaffleStatusBadge status={raffle.status} />
            </div>
            <div className="mt-5 flex items-end justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">Prize value</p>
                    <p className="mt-1 text-lg font-bold text-secondary">{raffle.prize}</p>
                </div>
                <p className="text-xs text-muted-foreground">Ends {raffle.ends}</p>
            </div>
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{raffle.progress}% capacity</span>
                    <span className="font-medium">{raffle.participants} participants</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-gradient-to-t from-primary/80 to-secondary"
                        style={{ width: `${raffle.progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export { RaffleCard };
