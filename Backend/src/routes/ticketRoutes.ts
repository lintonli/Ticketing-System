import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

const ticketRouter = Router();

ticketRouter.get("/", getTickets);
ticketRouter.get("/:id", getTicketById);
ticketRouter.post("/", createTicket);
ticketRouter.patch("/:id", updateTicket);
ticketRouter.delete("/:id", deleteTicket);

export default ticketRouter;