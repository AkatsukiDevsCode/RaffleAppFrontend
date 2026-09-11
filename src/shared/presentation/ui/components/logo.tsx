import { Sparkles } from "lucide-react";

function Logo() {
    return (
        <div className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_28px_var(--glow)]">
                <Sparkles className="size-4" />
            </span>
            <span className="text-lg">
                DevTalles <span className="text-secondary">Raffles</span>
            </span>
        </div>
    );
}

export { Logo };
