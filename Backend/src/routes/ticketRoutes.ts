import { Router } from "express";
import {
  createTicket,
  getTicketById,
  getTickets,
  getTicketStats,
  updateTicket,
} from "../controllers/ticketController.js";

const ticketRouter = Router();

ticketRouter.get("/", getTickets);
ticketRouter.get("/stats", getTicketStats);
ticketRouter.get("/:id", getTicketById);
ticketRouter.post("/", createTicket);
ticketRouter.patch("/:id", updateTicket);

export default ticketRouter;