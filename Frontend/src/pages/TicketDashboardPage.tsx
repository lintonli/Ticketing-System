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
import { toast } from "react-toastify";
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

export function TicketDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>(initialStats);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      setIsLoading(true);

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
        if (alive) {
          toast.error(getApiErrorMessage(loadError));
        }
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

    try {
      const response = await createTicket(values);
      setPage(1);
      setRefreshKey((current) => current + 1);
      toast.success(`Ticket "${response.data.title}" created successfully.`);
    } catch (createError) {
      toast.error(getApiErrorMessage(createError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, nextStatus: TicketStatus) => {
    setActiveTicketId(ticketId);

    try {
      await updateTicketStatus(ticketId, nextStatus);
      setRefreshKey((current) => current + 1);
      toast.success(`Ticket status updated to ${ticketStatusMeta[nextStatus].label}.`);
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
    } finally {
      setActiveTicketId(null);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="glow-ring left-[-6rem] top-[-4rem] h-80 w-80 bg-cyan-500/25" />
      <div className="glow-ring right-[-4rem] top-[10rem] h-96 w-96 bg-orange-500/20" />
      <div className="glow-ring bottom-[-6rem] left-1/3 h-96 w-96 bg-violet-500/20" />

      <main className="flex h-full w-full p-3 sm:p-4 lg:p-5">
        <section className="glass-panel flex min-h-0 w-full flex-1 flex-col rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Lodwar Services</p>
            <h1 className="text-2xl font-semibold text-white">Mini Ticket Tracker</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              A one-page workspace to create tickets, review stats, and manage the current ticket queue.
            </p>
          </div>

          <div className="mt-5 grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
            <div className="min-h-0 overflow-y-auto pr-1">
              <TicketForm onCreate={handleCreateTicket} isSubmitting={isSubmitting} />

              <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
                <StatCard label="Open" value={stats.open} detail="Tickets waiting for first response or assignment." accent="bg-emerald-400/30" />
                <StatCard label="In progress" value={stats.in_progress} detail="Tickets currently being worked through." accent="bg-amber-400/30" />
                <StatCard label="Closed" value={stats.closed} detail="Completed tickets with their status locked in." accent="bg-slate-400/20" />
                <StatCard label="Total" value={totalVisibleTickets} detail="The full live count returned by the API." accent="bg-cyan-400/30" />
              </div>
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50">
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 lg:flex-row lg:items-end lg:justify-between lg:px-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Unassigned tickets</h2>
                  <p className="text-sm text-slate-300">
                    Browse the current queue and make quick status changes without leaving the page.
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

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-5">
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

              <div className="shrink-0 border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur lg:px-5">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}