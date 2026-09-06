import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <section className="min-h-screen bg-slate-100">
            <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
                <div className="flex items-center gap-4">
                    <span>🎉</span>
                    <h1 className="font-bold tracking-tight">Akatsuki Raffle App</h1>
                </div>

                <button className="rounded-md border border-red-200 bg-red-100 px-4 py-2 text-red-700 transition hover:bg-red-200">
                    Logout
                </button>
            </header>

            <div className="px-6 py-6">
                <Outlet />
            </div>
        </section>
    );
}
