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
  useLocation,
  useNavigate,
} from "react-router-dom";
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

export function TicketDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const workspaceView: WorkspaceView =
    location.pathname === "/create" ? "create" : location.pathname === "/stats" ? "stats" : "tickets";

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
      navigate("/tickets", { replace: true });
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
    <>
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

              <div className="shrink-0 border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
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
    </>
  );
}