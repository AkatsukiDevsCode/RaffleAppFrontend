import { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy } from "lucide-react";

import { type Raffle } from "src/features/raffles/core/domain/raffle.interface";

import { WINNER_CANDIDATE_NAMES } from "src/features/raffles/presentation/constants/raffle-samples.constant";

const INITIAL_CONFETTI_BURST_DELAY_MS = 250;
const SECONDARY_CONFETTI_BURST_DELAY_MS = 450;

interface WinnerDrawModalProps {
    raffle: Raffle;
    onClose: () => void;
}

function WinnerDrawModal({ raffle, onClose }: WinnerDrawModalProps) {
    const [winnerName, setWinnerName] = useState<string | null>(null);
    const [isWinnerDrawn, setIsWinnerDrawn] = useState(false);

    const handleDrawWinner = () => {
        const winner = WINNER_CANDIDATE_NAMES[Math.floor(Math.random() * WINNER_CANDIDATE_NAMES.length)];
        setWinnerName(winner);
        setIsWinnerDrawn(true);

        confetti({
            particleCount: 180,
            spread: 100,
            origin: { y: 0.58 },
            colors: ["#8b5cf6", "#c4b5fd", "#f59e0b", "#ffffff"],
        });

        setTimeout(
            () =>
                confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.7 },
                }),
            INITIAL_CONFETTI_BURST_DELAY_MS,
        );

        setTimeout(
            () =>
                confetti({
                    particleCount: 100,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.7 },
                }),
            SECONDARY_CONFETTI_BURST_DELAY_MS,
        );
    };

    const handleCloseModal = () => {
        onClose();
    };

    if (isWinnerDrawn) {
        return (
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="winner-title"
                className="fixed inset-0 z-[90] grid place-items-center bg-background/85 p-5 backdrop-blur-md"
            >
                <div className="w-full max-w-lg rounded-3xl border border-secondary/50 bg-card p-8 text-center shadow-[0_0_90px_-18px_var(--glow)]">
                    <div className="mx-auto grid size-20 place-items-center rounded-full bg-secondary/15 text-secondary ring-8 ring-secondary/5">
                        <Trophy className="size-10" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Winner selected</p>
                    <h2 id="winner-title" className="mt-2 text-3xl font-bold">
                        Congratulations, {winnerName}!
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">You won the {raffle.title} raffle.</p>
                    <div className="mt-7 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary">
                        The winner has been selected from all {raffle.participants} registered participants.
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="mt-7 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="draw-title"
            className="fixed inset-0 z-[80] grid place-items-center bg-background/90 p-5 backdrop-blur-md"
        >
            <div className="w-full max-w-lg rounded-3xl border border-secondary/40 bg-card p-7 text-center shadow-[0_0_70px_-18px_var(--glow)]">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                    <Sparkles className="size-8" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Live raffle draw</p>
                <h2 id="draw-title" className="mt-2 text-2xl font-bold">
                    Who wins {raffle.title}?
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                    All {raffle.participants} registered participants are eligible. Start the draw when you are ready.
                </p>
                <div className="mt-7 flex gap-3">
                    <button
                        onClick={handleCloseModal}
                        className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:border-secondary/60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDrawWinner}
                        className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-12px_var(--glow)] transition hover:bg-accent"
                    >
                        <Trophy className="mr-2 inline size-4" />
                        Draw winner
                    </button>
                </div>
            </div>
        </div>
    );
}

export { WinnerDrawModal };
