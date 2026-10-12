import { useEffect, useState } from "react";
import type { Ticket } from "../types/ticket";
import {
  formatTicketDate,
  ticketPriorityMeta,
  ticketStatuses,
  ticketStatusMeta,
  type TicketStatus,
} from "../utils/tickets";
import { Pill } from "./ui/Pill";

interface TicketCardProps {
  ticket: Ticket;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  isUpdating: boolean;
}

export function TicketCard({ ticket, onUpdateStatus, isUpdating }: TicketCardProps) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);

  useEffect(() => {
    setStatus(ticket.status);
  }, [ticket.status]);

  const canSave = status !== ticket.status && !isUpdating;

  return (
    <article className="group rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4.5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-slate-950/75">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Pill tone={ticketStatusMeta[ticket.status].tone}>{ticketStatusMeta[ticket.status].label}</Pill>
            <Pill tone={ticketPriorityMeta[ticket.priority].tone}>{ticketPriorityMeta[ticket.priority].label}</Pill>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {ticket.description || "No description was supplied for this ticket."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Change status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as TicketStatus)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition [color-scheme:dark] focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
          >
            {ticketStatuses.map((option) => (
              <option key={option} value={option} className="bg-slate-900 text-white">
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={() => void onUpdateStatus(ticket.id, status)}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save status"}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-slate-400">
        <span>ID {ticket.id.slice(0, 8).toUpperCase()}</span>
        <span>{formatTicketDate(ticket.createdAt)}</span>
      </div>
    </article>
  );
}