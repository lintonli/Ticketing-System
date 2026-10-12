import type { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/db.js";
import {
  TicketPriority,
  TicketStatus,
} from "../generated/prisma/client.js";
import {
  createTicketSchema,
  ticketListQuerySchema,
  updateTicketSchema,
} from "../utils/ticket.validation.js";

const getTicketId = (value: unknown) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value.trim();
};

export const getTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = ticketListQuerySchema.validate(req.query, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Invalid ticket filters.",
        details: error.details.map((detail) => detail.message),
      });
    }

    const status = value.status as TicketStatus | undefined;
    const priority = value.priority as TicketPriority | undefined;
    const page = value.page ? Number(value.page) : 1;
    const limit = value.limit ? Number(value.limit) : 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      data: tickets,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticketId = getTicketId(req.params.id);
    if (!ticketId) {
      return res.status(400).json({ message: "Ticket id is required." });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    return res.status(200).json({ data: ticket });
  } catch (error) {
    return next(error);
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = createTicketSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Invalid ticket payload.",
        details: error.details.map((detail) => detail.message),
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: value.title,
        description: value.description ? value.description : null,
        status: value.status !== undefined ? value.status : TicketStatus.open,
        priority: value.priority !== undefined ? value.priority : TicketPriority.medium,
      },
    });

    return res.status(201).json({
      message: "Ticket created successfully.",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTicketStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await prisma.ticket.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const counts = Object.values(TicketStatus).reduce<Record<string, number>>(
      (accumulator, status) => {
        accumulator[status] = 0;
        return accumulator;
      },
      {},
    );

    for (const stat of stats) {
      counts[stat.status] = stat._count.status;
    }

    return res.status(200).json({ data: counts });
  } catch (error) {
    return next(error);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticketId = getTicketId(req.params.id);
    if (!ticketId) {
      return res.status(400).json({ message: "Ticket id is required." });
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true },
    });

    if (!existingTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const { error, value } = updateTicketSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Invalid ticket payload.",
        details: error.details.map((detail) => detail.message),
      });
    }

    const data: {
      title?: string;
      description?: string | null;
      status?: TicketStatus;
      priority?: TicketPriority;
    } = {};

    if (value.title !== undefined) {
      data.title = value.title;
    }

    if (value.description !== undefined) {
      data.description = value.description ? value.description : null;
    }

    if (value.status !== undefined) {
      data.status = value.status;
    }

    if (value.priority !== undefined) {
      data.priority = value.priority;
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data,
    });

    return res.status(200).json({
      message: "Ticket updated successfully.",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticketId = getTicketId(req.params.id);
    if (!ticketId) {
      return res.status(400).json({ message: "Ticket id is required." });
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};