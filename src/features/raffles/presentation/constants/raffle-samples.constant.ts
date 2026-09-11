import { type Raffle } from "src/features/raffles/core/domain/raffle.interface";
import { RAFFLE_STATUS } from "src/features/raffles/core/domain/raffle-status.enum";

export const SAMPLE_RAFFLES: Raffle[] = [
    {
        title: "MacBook Pro M4",
        category: "Hardware",
        status: RAFFLE_STATUS.LIVE,
        participants: "1,284",
        prize: "$2,499",
        ends: "2d 14h",
        progress: 78,
    },
    {
        title: "Mechanical Keyboard",
        category: "Hardware",
        status: RAFFLE_STATUS.LIVE,
        participants: "842",
        prize: "$219",
        ends: "5d 02h",
        progress: 54,
    },
    {
        title: "AI Tools Annual Pass",
        category: "Software",
        status: RAFFLE_STATUS.LIVE,
        participants: "1,106",
        prize: "$599",
        ends: "8d 19h",
        progress: 63,
    },
    {
        title: "Standing Desk Setup",
        category: "Workspace",
        status: RAFFLE_STATUS.DRAFT,
        participants: "0",
        prize: "$1,200",
        ends: "—",
        progress: 0,
    },
    {
        title: "RTX 5090 Build",
        category: "Hardware",
        status: RAFFLE_STATUS.CLOSED,
        participants: "2,341",
        prize: "$3,199",
        ends: "Jun 12",
        progress: 100,
    },
];

export const WINNER_CANDIDATE_NAMES = [
    "Sofía Martínez",
    "Carlos Mendoza",
    "Valentina Ríos",
    "Andrés García",
    "Camila Torres",
    "Mateo Silva",
    "Lucía Herrera",
] as const;
