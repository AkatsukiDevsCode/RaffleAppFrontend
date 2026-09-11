import { RaffleCard } from "src/features/raffles/presentation/components/cards/raffle-card";
import { SAMPLE_RAFFLES } from "src/features/raffles/presentation/constants/raffle-samples.constant";

export default function Dashboard() {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="mt-2 text-slate-600">¡React Router y TailwindCSS v4 están funcionando a la perfección! 🚀</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 transition-transform hover:scale-105">
                    <p className="text-sm font-semibold text-blue-600">Total Sorteos</p>
                    <p className="mt-1 text-3xl font-bold text-blue-900">12</p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50 p-4 transition-transform hover:scale-105">
                    <p className="text-sm font-semibold text-green-600">Ganancias</p>
                    <p className="mt-1 text-3xl font-bold text-green-900">$1,250</p>
                </div>
            </div>
            {/* Prueba de componente de card */}
            <RaffleCard raffle={SAMPLE_RAFFLES[0]} />
        </div>
    );
}
