import { useMemo, useState } from "react";
import {
    Activity,
    BarChart3,
    Bell,
    ChevronDown,
    CircleHelp,
    Download,
    Gift,
    LayoutDashboard,
    LogOut,
    Menu,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Trophy,
    Users,
    X,
    Zap,
} from "lucide-react";

import { Logo } from "src/shared/presentation/ui/components/logo";
import { StatCard } from "src/shared/presentation/ui/components/stat-card";

import { type Raffle, type RaffleFilter } from "src/features/raffles/core/domain/raffle.interface";
import { RAFFLE_STATUS } from "src/features/raffles/core/domain/raffle-status.enum";

import { RaffleCard } from "src/features/raffles/presentation/components/cards/raffle-card";
import { WinnerDrawModal } from "src/features/raffles/presentation/components/modals/winner-draw-modal";
import { RaffleResults } from "src/features/raffles/presentation/components/results/raffle-results";
import { SAMPLE_RAFFLES } from "src/features/raffles/presentation/constants/raffle-samples.constant";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const CHART_HEIGHTS = [42, 58, 48, 72, 63, 82, 68, 88, 76, 96, 83, 100] as const;
const CHART_LABELS = ["May 19", "", "", "May 26", "", "", "Jun 02", "", "", "Jun 09", "", ""] as const;
const SIDEBAR_ICONS_SIZE = "size-4" as const;
const MOBILE_NAV_ITEMS_COUNT = 4;

const nav = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Raffles", icon: Gift, count: "24" },
    { label: "Participants", icon: Users },
    { label: "Winner history", icon: Trophy },
    { label: "Analytics", icon: BarChart3 },
];

export default function AdminPage() {
    const [active, setActive] = useState("Overview");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<RaffleFilter>("All");
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [raffleItems, setRaffleItems] = useState(SAMPLE_RAFFLES);
    const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
    const [action, setAction] = useState<"view" | "edit" | "delete" | "winner" | null>(null);

    const filtered = useMemo(
        () =>
            raffleItems.filter(
                (raffle) =>
                    (filter === "All" || raffle.status === filter) && raffle.title.toLowerCase().includes(query.toLowerCase()),
            ),
        [filter, query, raffleItems],
    );

    const handleCloseAction = () => {
        setSelectedRaffle(null);
        setAction(null);
    };

    const handleUpdateRaffle = (updates: Partial<Raffle>) => {
        if (!selectedRaffle) return;
        setRaffleItems((items) => items.map((item) => (item.title === selectedRaffle.title ? { ...item, ...updates } : item)));
        handleCloseAction();
    };

    const handleDeleteRaffle = () => {
        if (!selectedRaffle) return;
        setRaffleItems((items) => items.filter((item) => item.title !== selectedRaffle.title));
        handleCloseAction();
    };

    const handleOpenMobileNav = () => {
        setIsMobileNavOpen(true);
    };

    const handleCloseMobileNav = () => {
        setIsMobileNavOpen(false);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalVisible(false);
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value as RaffleFilter);
    };

    const handleRaffleSearchChange = (nextQuery: string) => {
        setQuery(nextQuery);
    };

    const handleRaffleFilterChange = (nextFilter: RaffleFilter) => {
        setFilter(nextFilter);
    };

    const handlePickWinner = () => {
        setSelectedRaffle(raffleItems.find((item) => item.status === RAFFLE_STATUS.LIVE) ?? raffleItems[0]);
        setAction("winner");
    };

    const handleViewRaffle = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setAction("view");
    };

    const handleEditRaffle = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setAction("edit");
    };

    const handleSelectWinner = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setAction("winner");
    };

    const handleDeleteRaffleAction = (raffle: Raffle) => {
        setSelectedRaffle(raffle);
        setAction("delete");
    };

    const handleEditStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!selectedRaffle) return;
        setSelectedRaffle({
            ...selectedRaffle,
            status: event.target.value as Raffle["status"],
        });
    };

    const handleEditPrizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedRaffle) return;
        setSelectedRaffle({
            ...selectedRaffle,
            prize: event.target.value,
        });
    };

    const handleSaveChanges = () => {
        if (!selectedRaffle) return;
        handleUpdateRaffle({
            status: selectedRaffle.status,
            prize: selectedRaffle.prize,
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-card/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between">
                    <Logo />
                    <button className="rounded-lg p-2 lg:hidden" aria-label="Close navigation" onClick={handleCloseMobileNav}>
                        <X className="size-5" />
                    </button>
                </div>
                <div className="mt-12">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Workspace
                    </p>
                    <nav className="flex flex-col gap-1">
                        {nav.map(({ label, icon: Icon, count }) => {
                            const handleNavSelect = () => {
                                setActive(label);
                            };

                            return (
                                <button
                                    key={label}
                                    onClick={handleNavSelect}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                                        active === label
                                            ? "bg-primary/15 font-semibold text-secondary"
                                            : "text-muted-foreground hover:bg-surface hover:text-foreground"
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className={SIDEBAR_ICONS_SIZE} />
                                        {label}
                                    </span>
                                    {count && (
                                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-secondary">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-8">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        System
                    </p>
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground">
                        <Settings className={SIDEBAR_ICONS_SIZE} />
                        Settings
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground">
                        <CircleHelp className={SIDEBAR_ICONS_SIZE} />
                        Help center
                    </button>
                </div>
                <div className="mt-auto rounded-2xl border border-primary/25 bg-primary/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                        <Zap className="size-3.5" />
                        Live operations
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Everything is running smoothly. No actions needed.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-secondary">
                        <span className="size-1.5 animate-pulse rounded-full bg-secondary" />
                        All systems operational
                    </div>
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-5">
                    <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold">
                        JD
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">Juan DevTalles</p>
                        <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                    <button aria-label="Log out" className="text-muted-foreground hover:text-foreground">
                        <LogOut className={SIDEBAR_ICONS_SIZE} />
                    </button>
                </div>
            </aside>
            {isMobileNavOpen && (
                <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-background/70 lg:hidden"
                    onClick={handleCloseMobileNav}
                />
            )}
            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/50 bg-background/80 px-5 backdrop-blur-xl lg:px-10">
                    <div className="flex items-center gap-3">
                        <button aria-label="Open navigation" className="rounded-lg p-2 lg:hidden" onClick={handleOpenMobileNav}>
                            <Menu className="size-5" />
                        </button>
                        <div>
                            <p className="text-sm text-muted-foreground">Tuesday, June 17, 2025</p>
                            <h1 className="text-xl font-bold tracking-tight">Good morning, Juan</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Notifications"
                            className="relative rounded-xl border border-border/70 p-2.5 text-muted-foreground transition hover:border-secondary/50 hover:text-foreground"
                        >
                            <Bell className={SIDEBAR_ICONS_SIZE} />
                            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-secondary" />
                        </button>
                        <div className="hidden items-center gap-3 border-l border-border/60 pl-4 sm:flex">
                            <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold">
                                JD
                            </div>
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                        </div>
                    </div>
                </header>
                <div className="mx-auto max-w-[1500px] p-5 lg:p-10">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-secondary">
                                <Activity className="size-3.5" /> OVERVIEW
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your raffle command center</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                A clear view of what is happening across your community.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-12px_var(--glow)] transition hover:bg-accent"
                        >
                            <Plus className={SIDEBAR_ICONS_SIZE} />
                            Create raffle
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Active raffles" value="24" change="12.5%" icon={Gift} isAccent />
                        <StatCard label="Total participants" value="18,642" change="8.2%" icon={Users} />
                        <StatCard label="Prizes delivered" value="$42,890" change="16.4%" icon={Trophy} />
                        <StatCard label="Conversion rate" value="68.4%" change="4.8%" icon={BarChart3} />
                    </div>
                    <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">Participation overview</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Entries across all raffles · Last 30 days
                                    </p>
                                </div>
                                <button className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                                    Last 30 days <ChevronDown className="ml-1 inline size-3" />
                                </button>
                            </div>
                            <div className="mt-7 flex h-52 items-end gap-2 border-b border-border/60 pb-0 sm:gap-3">
                                {CHART_HEIGHTS.map((height, i) => (
                                    <div key={i} className="group flex flex-1 flex-col justify-end gap-2">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-secondary transition-all duration-300 group-hover:from-secondary group-hover:to-primary"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-center text-[10px] text-muted-foreground">{CHART_LABELS[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">Recent activity</h3>
                                    <p className="mt-1 text-xs text-muted-foreground">Latest platform events</p>
                                </div>
                                <button className="text-xs font-semibold text-secondary hover:text-foreground">View all</button>
                            </div>
                            <div className="mt-6 flex flex-col gap-5">
                                {[
                                    ["MG", "María G. joined MacBook Pro M4", "2 minutes ago"],
                                    ["AC", "Alex Chen won RTX 5090 Build", "18 minutes ago"],
                                    ["DR", "Diego R. joined AI Tools Annual Pass", "42 minutes ago"],
                                    ["JD", "You created Standing Desk Setup", "1 hour ago"],
                                ].map(([initials, text, time]) => (
                                    <div key={text} className="flex items-center gap-3">
                                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-secondary">
                                            {initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm">{text}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                    <section className="mt-5 rounded-2xl border border-border/70 bg-card/70">
                        <div className="flex flex-col gap-4 border-b border-border/60 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                            <div>
                                <h3 className="font-semibold">Raffle performance</h3>
                                <p className="mt-1 text-xs text-muted-foreground">Manage and monitor your active campaigns.</p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        aria-label="Search raffles"
                                        value={query}
                                        onChange={handleQueryChange}
                                        placeholder="Search raffles..."
                                        className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-secondary sm:w-56"
                                    />
                                </div>
                                <select
                                    aria-label="Filter by status"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-secondary"
                                >
                                    <option>All</option>
                                    <option>Live</option>
                                    <option>Draft</option>
                                    <option>Closed</option>
                                </select>
                                <button
                                    aria-label="Export raffles"
                                    className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
                                >
                                    <Download className={SIDEBAR_ICONS_SIZE} />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead className="border-b border-border/60 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-4 font-medium lg:px-6">Raffle</th>
                                        <th className="px-5 py-4 font-medium">Status</th>
                                        <th className="px-5 py-4 font-medium">Participants</th>
                                        <th className="px-5 py-4 font-medium">Prize value</th>
                                        <th className="px-5 py-4 font-medium">Ends</th>
                                        <th className="px-5 py-4 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((raffle) => (
                                        <tr
                                            key={raffle.title}
                                            className="border-b border-border/50 transition last:border-0 hover:bg-surface/50"
                                        >
                                            <td className="px-5 py-4 lg:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-secondary">
                                                        <Gift className={SIDEBAR_ICONS_SIZE} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{raffle.title}</p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {raffle.category} · {raffle.progress}% capacity
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        raffle.status === "Live"
                                                            ? "bg-secondary/15 text-secondary"
                                                            : raffle.status === "Draft"
                                                              ? "bg-muted text-muted-foreground"
                                                              : "bg-primary/15 text-primary-foreground"
                                                    }`}
                                                >
                                                    {raffle.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium">{raffle.participants}</td>
                                            <td className="px-5 py-4 text-secondary">{raffle.prize}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{raffle.ends}</td>
                                            <td className="px-5 py-4">
                                                <button
                                                    aria-label={`More options for ${raffle.title}`}
                                                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <MoreHorizontal className={SIDEBAR_ICONS_SIZE} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div className="p-10 text-center text-sm text-muted-foreground">
                                    No raffles match your search.
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between border-t border-border/60 px-5 py-4 text-xs text-muted-foreground lg:px-6">
                            <span>
                                Showing {filtered.length} of {SAMPLE_RAFFLES.length} raffles
                            </span>
                            <div className="flex gap-2">
                                <button className="rounded-lg border border-border px-3 py-1.5 hover:text-foreground">
                                    Previous
                                </button>
                                <button className="rounded-lg border border-border px-3 py-1.5 text-secondary hover:text-foreground">
                                    Next
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {active === "Raffles" && (
                <section className="fixed inset-0 z-20 overflow-y-auto bg-background px-5 pb-24 pt-24 lg:left-72 lg:px-10">
                    <div className="mx-auto max-w-[1500px]">
                        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-secondary">
                                    <Gift className="size-3.5" /> RAFFLES
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Manage your raffles</h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create, edit, monitor and select winners from one place.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    onClick={handlePickWinner}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/20"
                                >
                                    <Trophy className={SIDEBAR_ICONS_SIZE} />
                                    Pick a winner
                                </button>
                                <button
                                    onClick={handleOpenCreateModal}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-12px_var(--glow)] transition hover:bg-accent"
                                >
                                    <Plus className={SIDEBAR_ICONS_SIZE} />
                                    Create raffle
                                </button>
                            </div>
                        </div>
                        <RaffleResults
                            raffles={filtered}
                            searchQuery={query}
                            statusFilter={filter}
                            onSearchQueryChange={handleRaffleSearchChange}
                            onStatusFilterChange={handleRaffleFilterChange}
                            onViewRaffle={handleViewRaffle}
                            onEditRaffle={handleEditRaffle}
                            onSelectWinner={handleSelectWinner}
                            onDeleteRaffle={handleDeleteRaffleAction}
                        />
                    </div>
                </section>
            )}
            {action && action !== "winner" && selectedRaffle && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[70] grid place-items-center bg-background/80 p-5 backdrop-blur-sm"
                >
                    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                                    {action === "delete" ? "Delete raffle" : "Raffle details"}
                                </p>
                                <h2 className="mt-2 text-xl font-bold">{selectedRaffle.title}</h2>
                            </div>
                            <button
                                aria-label="Close raffle action"
                                onClick={handleCloseAction}
                                className="rounded-lg p-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className={SIDEBAR_ICONS_SIZE} />
                            </button>
                        </div>
                        {action === "view" && <RaffleCard raffle={selectedRaffle} />}
                        {action === "edit" && (
                            <div className="mt-6 flex flex-col gap-4">
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Status
                                    <select
                                        value={selectedRaffle.status}
                                        onChange={handleEditStatusChange}
                                        className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-secondary"
                                    >
                                        <option>Live</option>
                                        <option>Draft</option>
                                        <option>Closed</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Prize value
                                    <input
                                        value={selectedRaffle.prize}
                                        onChange={handleEditPrizeChange}
                                        className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-secondary"
                                    />
                                </label>
                                <button
                                    onClick={handleSaveChanges}
                                    className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-accent"
                                >
                                    Save changes
                                </button>
                            </div>
                        )}
                        {action === "delete" && (
                            <div className="mt-6">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    This will permanently remove the raffle from the admin list. This action cannot be undone.
                                </p>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleCloseAction}
                                        className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteRaffle}
                                        className="flex-1 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground"
                                    >
                                        Delete raffle
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {action === "winner" && selectedRaffle && <WinnerDrawModal raffle={selectedRaffle} onClose={handleCloseAction} />}
            {isCreateModalVisible && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-title"
                    className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-5 backdrop-blur-sm"
                >
                    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 id="create-title" className="text-xl font-bold">
                                    Create a raffle
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">Set up your next community drop.</p>
                            </div>
                            <button
                                aria-label="Close dialog"
                                onClick={handleCloseCreateModal}
                                className="rounded-lg p-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className={SIDEBAR_ICONS_SIZE} />
                            </button>
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            <label className="flex flex-col gap-2 text-sm font-medium">
                                Raffle name
                                <input
                                    className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-secondary"
                                    placeholder="e.g. MacBook Pro M4"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium">
                                Prize value
                                <input
                                    className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-secondary"
                                    placeholder="$2,499"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium">
                                Category
                                <select className="rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-secondary">
                                    <option>Hardware</option>
                                    <option>Software</option>
                                    <option>Workspace</option>
                                </select>
                            </label>
                        </div>
                        <div className="mt-7 flex gap-3">
                            <button
                                onClick={handleCloseCreateModal}
                                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:border-secondary/60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCloseCreateModal}
                                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-accent"
                            >
                                Create raffle
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-border/60 bg-card/95 px-2 py-2 backdrop-blur-xl lg:hidden">
                {nav.slice(0, MOBILE_NAV_ITEMS_COUNT).map(({ label, icon: Icon }) => {
                    const handleMobileNavSelect = () => {
                        setActive(label);
                    };

                    return (
                        <button
                            key={label}
                            onClick={handleMobileNavSelect}
                            className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] ${
                                active === label ? "text-secondary" : "text-muted-foreground"
                            }`}
                        >
                            <Icon className={SIDEBAR_ICONS_SIZE} />
                            {label}
                        </button>
                    );
                })}
            </div>
        </main>
    );
}
