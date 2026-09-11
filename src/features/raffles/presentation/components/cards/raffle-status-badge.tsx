import { cn } from "src/shared/core/utils/cn.util";

import { RAFFLE_STATUS, type RaffleStatus } from "src/features/raffles/core/domain/raffle-status.enum";

const RAFFLE_STATUS_BADGE_CLASSES: Record<RaffleStatus, string> = {
    [RAFFLE_STATUS.LIVE]: "bg-secondary/15 text-secondary",
    [RAFFLE_STATUS.DRAFT]: "bg-muted text-muted-foreground",
    [RAFFLE_STATUS.CLOSED]: "bg-primary/15 text-primary-foreground",
};

interface RaffleStatusBadgeProps {
    status: RaffleStatus;
}

function RaffleStatusBadge({ status }: RaffleStatusBadgeProps) {
    return (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", RAFFLE_STATUS_BADGE_CLASSES[status])}>
            {status}
        </span>
    );
}

export { RaffleStatusBadge };
