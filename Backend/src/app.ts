import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import ticketRouter from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN;

if (!frontendOrigin) {
  throw new Error("FRONTEND_ORIGIN is not defined in environment variables");
}

const frontendOrigins = frontendOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: frontendOrigins,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tickets", ticketRouter);

export default app;