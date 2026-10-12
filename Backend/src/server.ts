import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import { checkDatabaseConnection } from "./prisma/db.js";
import ticketRouter from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
const port = Number(process.env.PORT) || 3000;
/**
 * Handle uncaught exceptions
 */
process.on("uncaughtException", (err: Error) => {
  logger.error(`Error: ${err.message}`);
  logger.error("Shutting down due to uncaught exception");
  process.exit(1);
});

void checkDatabaseConnection();

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tickets", ticketRouter);

const server = app.listen(port, ()=>{
    logger.info(`Server started on PORT: ${port} in ${process.env.NODE_ENV} mode`);
});

/**
 * Handle uncaught promise rejections
 */
process.on("unhandledRejection", (err: Error) => {
  logger.error(err.message);
  logger.error("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});