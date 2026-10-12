import type { TicketPriority, TicketStatus } from "../utils/tickets";

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

export interface TicketFormValues {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface TicketUpdatePayload {
  status: TicketStatus;
}

export interface TicketListResponse {
  page: number;
  limit: number;
  total: number;
  data: Ticket[];
}

export interface TicketStats {
  open: number;
  in_progress: number;
  closed: number;
}

export interface TicketStatsResponse {
  data: TicketStats;
}