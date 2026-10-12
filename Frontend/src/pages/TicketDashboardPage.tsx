import { useEffect, useState } from "react";
import {
  createTicket,
  fetchTicketStats,
  fetchTickets,
  getApiErrorMessage,
  updateTicketStatus,
} from "../services/tickets";
import type { Ticket, TicketFormValues, TicketStats } from "../types/ticket";
import { Pagination } from "../components/Pagination";
import { StatCard } from "../components/ui/StatCard";
import { TicketCard } from "../components/TicketCard";
import { TicketForm } from "../components/TicketForm";
import {
  statusFilterOptions,
  ticketStatusMeta,
  type TicketStatus,
} from "../utils/tickets";

const initialStats: TicketStats = {
  open: 0,
  in_progress: 0,
  closed: 0,
};

type FilterStatus = TicketStatus | "all";
type WorkspaceView = "create" | "stats" | "tickets";

const workspaceViewCopy: Record<WorkspaceView, { title: string; description: string }> = {
  create: {
    title: "Create ticket",
    description: "Use the form to add a new ticket without leaving the workspace.",
  },
  stats: {
    title: "Stats view",
    description: "Review the live status breakdown returned by the API.",
  },
  tickets: {
    title: "Ticket view",
    description: "Browse, filter, paginate, and update tickets from one place.",
  },
};

export function TicketDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>(initialStats);
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("tickets");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [ticketList, ticketStats] = await Promise.all([
          fetchTickets({ status: statusFilter, page, limit: pageSize }),
          fetchTicketStats(),
        ]);

        if (!alive) {
          return;
        }

        setTickets(ticketList.data);
        setTotal(ticketList.total);
        setStats(ticketStats);
      } catch (loadError) {
        if (!alive) {
          return;
        }

        setError(getApiErrorMessage(loadError));
      } finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      alive = false;
    };
  }, [page, refreshKey, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const totalVisibleTickets = stats.open + stats.in_progress + stats.closed;

  const handleCreateTicket = async (values: TicketFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createTicket(values);
      setNotice(`Ticket "${response.data.title}" created successfully.`);
      setPage(1);
      setRefreshKey((current) => current + 1);
      setWorkspaceView("tickets");
    } catch (createError) {
      setError(getApiErrorMessage(createError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, nextStatus: TicketStatus) => {
    setActiveTicketId(ticketId);
    setError(null);

    try {
      await updateTicketStatus(ticketId, nextStatus);
      setNotice(`Ticket status updated to ${ticketStatusMeta[nextStatus].label}.`);
      setRefreshKey((current) => current + 1);
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    } finally {
      setActiveTicketId(null);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="glow-ring left-[-6rem] top-[-4rem] h-80 w-80 bg-cyan-500/25" />
      <div className="glow-ring right-[-4rem] top-[10rem] h-96 w-96 bg-orange-500/20" />
      <div className="glow-ring bottom-[-6rem] left-1/3 h-96 w-96 bg-violet-500/20" />

      <main className="flex h-full w-full gap-3 p-3 sm:p-4 lg:p-5">
        <aside className="glass-panel flex h-full w-full shrink-0 flex-col rounded-[2rem] p-3.5 lg:w-72">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3.5">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Lodwar Services</p>
            <h1 className="mt-2 text-xl font-semibold text-white">Mini Ticket Tracker</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              A lean workspace for creating tickets, reading stats, and moving tickets forward.
            </p>
          </div>

          <nav className="mt-3 space-y-1.5">
            {(Object.keys(workspaceViewCopy) as WorkspaceView[]).map((view) => {
              const isActive = workspaceView === view;

              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setWorkspaceView(view)}
                  className={`w-full rounded-2xl border px-3.5 py-3 text-left transition ${
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/10 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.2)]"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold capitalize">{view}</span>
                    {view === "tickets" ? <span className="text-xs text-slate-400">{total} total</span> : null}
                    {view === "stats" ? <span className="text-xs text-slate-400">live</span> : null}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{workspaceViewCopy[view].description}</p>
                </button>
              );
            })}
          </nav>

          <div className="mt-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3.5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live counts</p>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-400/10 px-3 py-2 text-sm">
                <span>Open</span>
                <span className="font-semibold text-emerald-200">{stats.open}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-amber-400/10 px-3 py-2 text-sm">
                <span>In progress</span>
                <span className="font-semibold text-amber-200">{stats.in_progress}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-400/10 px-3 py-2 text-sm">
                <span>Closed</span>
                <span className="font-semibold text-slate-200">{stats.closed}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          {notice ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {notice}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <section className="flex min-h-0 flex-1 flex-col rounded-[2rem]">
            <div className="flex flex-col gap-2 px-1 pt-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{workspaceViewCopy[workspaceView].title}</p>
                <h2 className="mt-1.5 text-xl font-semibold text-white">{workspaceViewCopy[workspaceView].description}</h2>
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              {workspaceView === "create" ? (
                <TicketForm onCreate={handleCreateTicket} isSubmitting={isSubmitting} />
              ) : null}

              {workspaceView === "stats" ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Open" value={stats.open} detail="Tickets waiting for first response or assignment." accent="bg-emerald-400/30" />
                  <StatCard label="In progress" value={stats.in_progress} detail="Tickets currently being worked through." accent="bg-amber-400/30" />
                  <StatCard label="Closed" value={stats.closed} detail="Completed tickets with their status locked in." accent="bg-slate-400/20" />
                  <StatCard label="Total" value={totalVisibleTickets} detail="The full live count returned by the API." accent="bg-cyan-400/30" />
                </div>
              ) : null}

              {workspaceView === "tickets" ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex flex-col gap-3 border-b border-white/10 pb-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Unassigned tickets</h3>
                      <p className="text-sm text-slate-300">
                        Browse the current ticket queue and make quick status changes without leaving the view.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="rounded-xl border border-cyan-300/50 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
                      >
                        Filter
                      </button>

                      <label className="text-sm text-slate-300">
                        Status
                        <select
                          value={statusFilter}
                          onChange={(event) => {
                            setPage(1);
                            setStatusFilter(event.target.value as FilterStatus);
                          }}
                          className="ml-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none [color-scheme:dark]"
                        >
                          {statusFilterOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                    </div>
                  </div>

                  <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 pb-28">
                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="rounded-[1.5rem] border border-dashed border-white/10 px-6 py-8 text-center text-sm text-slate-400">
                          Loading fresh tickets from the API...
                        </div>
                      ) : tickets.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-white/10 px-6 py-8 text-center text-sm text-slate-400">
                          No tickets match the current filter. Create one to get the board moving.
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onUpdateStatus={handleStatusUpdate}
                            isUpdating={activeTicketId === ticket.id}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  <div className="fixed bottom-4 left-3 right-3 z-20 rounded-[1.5rem] border border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_-16px_40px_rgba(2,6,23,0.45)] backdrop-blur lg:left-[19rem] lg:right-5">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      totalItems={total}
                      pageSize={pageSize}
                      onPageChange={setPage}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}