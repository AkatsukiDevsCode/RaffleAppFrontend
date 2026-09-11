import { Search } from "lucide-react";

import { type Raffle, type RaffleFilter } from "src/features/raffles/core/domain/raffle.interface";
import { RAFFLE_STATUS } from "src/features/raffles/core/domain/raffle-status.enum";

import { RaffleStatusBadge } from "src/features/raffles/presentation/components/cards/raffle-status-badge";

const RAFFLE_STATUS_VALUES = Object.values(RAFFLE_STATUS);

interface RaffleResultsProps {
    raffles: Raffle[];
    searchQuery: string;
    statusFilter: RaffleFilter;
    onSearchQueryChange: (query: string) => void;
    onStatusFilterChange: (filter: RaffleFilter) => void;
    onViewRaffle: (raffle: Raffle) => void;
    onEditRaffle: (raffle: Raffle) => void;
    onSelectWinner: (raffle: Raffle) => void;
    onDeleteRaffle: (raffle: Raffle) => void;
}

function RaffleResults({
    raffles,
    searchQuery,
    statusFilter,
    onSearchQueryChange,
    onStatusFilterChange,
    onViewRaffle,
    onEditRaffle,
    onSelectWinner,
    onDeleteRaffle,
}: RaffleResultsProps) {
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchQueryChange(event.target.value);
    };

    const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusFilterChange(event.target.value as RaffleFilter);
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70">
            <div className="flex flex-col gap-4 border-b border-border/60 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h3 className="font-semibold">Raffle performance</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Your active campaigns and their current status.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            aria-label="Search raffles in management"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search raffles..."
                            className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-secondary sm:w-56"
                        />
                    </div>
                    <select
                        aria-label="Filter raffle status"
                        value={statusFilter}
                        onChange={handleFilterSelect}
                        className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-secondary"
                    >
                        <option value="All">All</option>
                        {RAFFLE_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-border/60 text-xs text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4 font-medium">Raffle</th>
                            <th className="px-5 py-4 font-medium">Status</th>
                            <th className="px-5 py-4 font-medium">Participants</th>
                            <th className="px-5 py-4 font-medium">Prize</th>
                            <th className="px-5 py-4 font-medium">Ends</th>
                            <th className="px-5 py-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raffles.map((raffle) => {
                            const handleViewRaffle = () => {
                                onViewRaffle(raffle);
                            };
                            const handleEditRaffle = () => {
                                onEditRaffle(raffle);
                            };
                            const handleSelectWinner = () => {
                                onSelectWinner(raffle);
                            };
                            const handleDeleteRaffle = () => {
                                onDeleteRaffle(raffle);
                            };

                            return (
                                <tr key={raffle.title} className="border-b border-border/50 last:border-0 hover:bg-surface/50">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{raffle.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{raffle.category}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <RaffleStatusBadge status={raffle.status} />
                                    </td>
                                    <td className="px-5 py-4 text-muted-foreground">{raffle.participants}</td>
                                    <td className="px-5 py-4 font-medium">{raffle.prize}</td>
                                    <td className="px-5 py-4 text-muted-foreground">{raffle.ends}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={handleViewRaffle}
                                                className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:border-secondary"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={handleEditRaffle}
                                                className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:border-secondary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleSelectWinner}
                                                disabled={raffle.status !== RAFFLE_STATUS.LIVE}
                                                className="rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-semibold text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Winner
                                            </button>
                                            <button
                                                onClick={handleDeleteRaffle}
                                                className="rounded-lg border border-destructive/40 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {raffles.length === 0 && (
                    <div className="p-10 text-center text-sm text-muted-foreground">No raffles match your search.</div>
                )}
            </div>
        </section>
    );
}

export { RaffleResults };
