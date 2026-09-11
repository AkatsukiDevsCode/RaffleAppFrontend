export const RAFFLE_STATUS = {
    LIVE: "Live",
    DRAFT: "Draft",
    CLOSED: "Closed",
} as const;

export type RaffleStatus = (typeof RAFFLE_STATUS)[keyof typeof RAFFLE_STATUS];
