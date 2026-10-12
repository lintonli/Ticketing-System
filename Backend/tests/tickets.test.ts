import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  ticket: {
    create: vi.fn(),
    count: vi.fn(),
    findMany: vi.fn(),
    groupBy: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/prisma/db.js", () => ({
  prisma: {
    ticket: prismaMocks.ticket,
  },
  checkDatabaseConnection: vi.fn(),
}));

const { default: app } = await import("../src/app.js");

describe("ticket API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a ticket", async () => {
    prismaMocks.ticket.create.mockResolvedValue({
      id: "ticket-1",
      title: "Login page fails",
      description: "Users cannot sign in",
      status: "open",
      priority: "high",
      createdAt: new Date("2026-10-12T00:00:00.000Z"),
    });

    const response = await request(app).post("/api/tickets").send({
      title: "Login page fails",
      description: "Users cannot sign in",
      status: "open",
      priority: "high",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Ticket created successfully.");
    expect(response.body.data.title).toBe("Login page fails");
    expect(prismaMocks.ticket.create).toHaveBeenCalledWith({
      data: {
        title: "Login page fails",
        description: "Users cannot sign in",
        status: "open",
        priority: "high",
      },
    });
  });

  it("lists tickets with pagination and filters", async () => {
    prismaMocks.ticket.findMany.mockResolvedValue([
      {
        id: "ticket-1",
        title: "Login page fails",
        description: null,
        status: "open",
        priority: "high",
        createdAt: new Date("2026-10-12T00:00:00.000Z"),
      },
    ]);
    prismaMocks.ticket.count.mockResolvedValue(1);

    const response = await request(app)
      .get("/api/tickets")
      .query({ status: "open", page: 2, limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(2);
    expect(response.body.limit).toBe(1);
    expect(response.body.total).toBe(1);
    expect(response.body.data).toHaveLength(1);
    expect(prismaMocks.ticket.findMany).toHaveBeenCalledWith({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      skip: 1,
      take: 1,
    });
    expect(prismaMocks.ticket.count).toHaveBeenCalledWith({
      where: { status: "open" },
    });
  });

  it("returns ticket stats grouped by status", async () => {
    prismaMocks.ticket.groupBy.mockResolvedValue([
      { status: "open", _count: { status: 2 } },
      { status: "closed", _count: { status: 1 } },
    ]);

    const response = await request(app).get("/api/tickets/stats");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      open: 2,
      in_progress: 0,
      closed: 1,
    });
    expect(prismaMocks.ticket.groupBy).toHaveBeenCalledWith({
      by: ["status"],
      _count: { status: true },
    });
  });
});