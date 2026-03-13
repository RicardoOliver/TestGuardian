import cors from "cors";
import express from "express";
import morgan from "morgan";

import environmentsRouter from "./routes/environments.js";
import pipelinesRouter from "./routes/pipelines.js";
import qualityRouter from "./routes/quality.js";
import testAutomationRouter from "./routes/test-automation.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({
      service: "qaops-api",
      status: "ok",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/environments", environmentsRouter);
  app.use("/api/pipelines", pipelinesRouter);
  app.use("/api/test-automation", testAutomationRouter);
  app.use("/api/quality", qualityRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route not found: ${req.method} ${req.path}`
    });
  });

  app.use((error, _req, res, _next) => {
    const status = error.status ?? 500;
    res.status(status).json({
      message: error.message || "Unexpected server error",
      details: error.details ?? null
    });
  });

  return app;
}
