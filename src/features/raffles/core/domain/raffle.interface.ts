import { type RaffleStatus } from "src/features/raffles/core/domain/raffle-status.enum";

export interface Raffle {
    title: string;
    category: string;
    status: RaffleStatus;
    participants: string;
    prize: string;
    ends: string;
    progress: number;
}

export type RaffleFilter = "All" | RaffleStatus;
