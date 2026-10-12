export const ticketStatuses = ["open", "in_progress", "closed"] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

export const ticketPriorities = ["low", "medium", "high"] as const;
export type TicketPriority = (typeof ticketPriorities)[number];

export const ticketStatusMeta: Record<
  TicketStatus,
  { label: string; tone: string; helper: string }
> = {
  open: {
    label: "Open",
    tone: "emerald",
    helper: "Queued and ready for triage",
  },
  in_progress: {
    label: "In progress",
    tone: "amber",
    helper: "Someone is actively working on it",
  },
  closed: {
    label: "Closed",
    tone: "slate",
    helper: "Resolved and archived",
  },
};

export const ticketPriorityMeta: Record<
  TicketPriority,
  { label: string; tone: string }
> = {
  low: { label: "Low", tone: "sky" },
  medium: { label: "Medium", tone: "violet" },
  high: { label: "High", tone: "rose" },
};

export const statusFilterOptions = [
  { value: "all", label: "All statuses" },
  ...ticketStatuses.map((status) => ({
    value: status,
    label: ticketStatusMeta[status].label,
  })),
] as const;

export const priorityOptions: ReadonlyArray<{
  value: TicketPriority;
  label: string;
}> = ticketPriorities.map((priority) => ({
  value: priority,
  label: ticketPriorityMeta[priority].label,
}));

export const toneClasses: Record<string, string> = {
  emerald: "border-emerald-400/25 bg-emerald-400/12 text-emerald-100",
  amber: "border-amber-400/25 bg-amber-400/12 text-amber-100",
  slate: "border-slate-400/25 bg-slate-400/12 text-slate-100",
  sky: "border-sky-400/25 bg-sky-400/12 text-sky-100",
  violet: "border-violet-400/25 bg-violet-400/12 text-violet-100",
  rose: "border-rose-400/25 bg-rose-400/12 text-rose-100",
};

export const formatTicketDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));