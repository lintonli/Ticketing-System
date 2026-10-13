import axios, { AxiosError } from "axios";
import type {
  Ticket,
  TicketFormValues,
  TicketListResponse,
  TicketStatsResponse,
  TicketUpdatePayload,
} from "../types/ticket";
import type { TicketStatus } from "../utils/tickets";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TicketListQuery {
  status?: TicketStatus | "all";
  page?: number;
  limit?: number;
}

const getTicketsUrl = (query?: TicketListQuery) => {
  const url = new URL("/api/tickets", API_BASE_URL);

  if (query?.status && query.status !== "all") {
    url.searchParams.set("status", query.status);
  }

  if (query?.page) {
    url.searchParams.set("page", String(query.page));
  }

  if (query?.limit) {
    url.searchParams.set("limit", String(query.limit));
  }

  return url.toString();
};

export async function fetchTickets(query?: TicketListQuery) {
  const { data } = await api.get<TicketListResponse>(getTicketsUrl(query));
  return data;
}

export async function fetchTicketStats() {
  const { data } = await api.get<TicketStatsResponse>("/api/tickets/stats");
  return data.data;
}

export async function createTicket(values: TicketFormValues) {
  const { data } = await api.post<{ message: string; data: Ticket }>("/api/tickets", {
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
  });

  return data;
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  const { data } = await api.patch<{ message: string; data: Ticket }>(`/api/tickets/${id}`, {
    status,
  } satisfies TicketUpdatePayload);

  return data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const responseMessage = axiosError.response?.data?.message;
    return responseMessage ?? axiosError.message ?? "A request to the API failed.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "A request to the API failed.";
}