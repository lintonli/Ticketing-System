import Joi from "joi";
import { TicketPriority, TicketStatus } from "../generated/prisma/client.js";

const ticketStatusValues = Object.values(TicketStatus);
const ticketPriorityValues = Object.values(TicketPriority);

export const ticketListQuerySchema = Joi.object({
  status: Joi.string().valid(...ticketStatusValues),
  priority: Joi.string().valid(...ticketPriorityValues),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
}).unknown(false);

export const createTicketSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow(null, "").optional(),
  status: Joi.string().valid(...ticketStatusValues).optional(),
  priority: Joi.string().valid(...ticketPriorityValues).optional(),
}).unknown(false);

export const updateTicketSchema = Joi.object({
  title: Joi.string().trim().min(1),
  description: Joi.string().trim().allow(null, "").optional(),
  status: Joi.string().valid(...ticketStatusValues),
  priority: Joi.string().valid(...ticketPriorityValues),
})
  .min(1)
  .unknown(false);