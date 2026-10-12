import dotenv from "dotenv";
import logger from "../../utils/logger.js";
import { TicketPriority, TicketStatus } from "../../generated/prisma/client.js";
import { prisma } from "../db.js";

dotenv.config();

const tickets = [
	{
		title: "Login page not loading",
		description: "Users are seeing a blank screen after submitting the login form.",
		status: TicketStatus.open,
		priority: TicketPriority.high,
	},
	{
		title: "Email notifications delayed",
		description: "Ticket assignment emails arrive several minutes late.",
		status: TicketStatus.in_progress,
		priority: TicketPriority.medium,
	},
	{
		title: "Search results missing archived tickets",
		description: "Archived tickets should still appear when the filter is enabled.",
		status: TicketStatus.open,
		priority: TicketPriority.medium,
	},
	{
		title: "Dashboard count off by one",
		description: "Closed ticket totals do not match the ticket table.",
		status: TicketStatus.closed,
		priority: TicketPriority.low,
	},
	{
		title: "Assignee filter resets on refresh",
		description: "Refreshing the page clears the selected assignee filter state.",
		status: TicketStatus.in_progress,
		priority: TicketPriority.high,
	},
];

async function main() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined in environment variables");
	}

	await prisma.ticket.deleteMany();
	await prisma.ticket.createMany({ data: tickets });

	logger.info(`Seeded ${tickets.length} tickets.`);
}

main()
	.catch((error: unknown) => {
		const message = error instanceof Error ? error.message : "Unknown seed error";
		logger.error(message);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
