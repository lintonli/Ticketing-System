import express from "express";
import ticketRouter from "./routes/ticketRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tickets", ticketRouter);

export default app;