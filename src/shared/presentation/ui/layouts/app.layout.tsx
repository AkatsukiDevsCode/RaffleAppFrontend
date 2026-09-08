import { Outlet } from "react-router-dom";

import { Button } from "src/shared/presentation/ui/components/button";

export default function AppLayout() {
    return (
        <section className="min-h-screen bg-background text-foreground">
            <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
                <div className="flex items-center gap-4">
                    <span>🎉</span>
                    <h1 className="font-bold tracking-tight">Akatsuki Raffle App</h1>
                </div>

                <Button variant="destructive">Logout</Button>
            </header>

            <div className="px-6 py-6">
                <Outlet />
            </div>
        </section>
    );
}
