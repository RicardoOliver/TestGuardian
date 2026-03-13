import express from "express";
import { PlatformStore } from "./store.js";
import {
  assertInteger,
  assertNumber,
  assertObject,
  assertString
} from "./validators.js";
import { AppError } from "./errors.js";
import { metricsStore } from "./metrics.js";
import { createMetricsRouter } from "./routes/metrics.js";

export function createApp(store = new PlatformStore()) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });


  app.use(createMetricsRouter(metricsStore));
  app.get("/api/environments", (req, res) => {
    const type = req.query.type ? assertString(req.query.type, "type") : undefined;
    res.json({ items: store.listEnvironments({ type }) });
  });

  app.post("/api/environments", (req, res) => {
    assertObject(req.body, "body");

    const environment = store.createEnvironment({
      name: assertString(req.body.name, "name"),
      type: assertString(req.body.type, "type"),
      stability: assertString(req.body.stability, "stability"),
      dataProfile: assertString(req.body.dataProfile, "dataProfile"),
      preview: Boolean(req.body.preview),
      prNumber: req.body.prNumber,
      ttlHours: req.body.ttlHours
    });

    res.status(201).json(environment);
  });

  app.patch("/api/environments/:environmentId/status", (req, res) => {
    const environmentId = assertString(req.params.environmentId, "environmentId");
    const status = assertString(req.body.status, "status");

    const environment = store.updateEnvironmentStatus(environmentId, status);
    res.json(environment);
  });

  app.post("/api/preview/:prNumber/provision", (req, res) => {
    const prNumber = Number(req.params.prNumber);
    assertInteger(prNumber, "prNumber", { min: 1 });

    const environment = store.provisionPreview(prNumber);
    res.status(201).json(environment);
  });

  app.delete("/api/preview/:prNumber", (req, res) => {
    const prNumber = Number(req.params.prNumber);
    assertInteger(prNumber, "prNumber", { min: 1 });

    const destroyed = store.destroyPreview(prNumber);
    res.json(destroyed);
  });

  app.get("/api/pipelines", (_req, res) => {
    res.json({ items: store.listPipelines() });
  });

  app.post("/api/pipelines", (req, res) => {
    assertObject(req.body, "body");

    const stages = req.body.stages ?? ["Build", "Deploy", "Automated Tests", "QA Validation"];
    if (!Array.isArray(stages) || stages.length === 0) {
      throw new AppError("'stages' must be a non-empty array", 422, "VALIDATION_ERROR");
    }

    const pipeline = store.createPipeline({
      environmentId: assertString(req.body.environmentId, "environmentId"),
      commitSha: assertString(req.body.commitSha, "commitSha", { minLength: 7 }),
      stages: stages.map((stage) => assertString(stage, "stage"))
    });

    res.status(201).json(pipeline);
  });

  app.patch("/api/pipelines/:pipelineId/stages/:stageName", (req, res) => {
    const pipeline = store.updatePipelineStage({
      pipelineId: assertString(req.params.pipelineId, "pipelineId"),
      stageName: assertString(req.params.stageName, "stageName"),
      status: assertString(req.body.status, "status")
    });

    res.json(pipeline);
  });

  app.get("/api/tests/runs", (_req, res) => {
    res.json({ items: store.listTestRuns() });
  });

  app.post("/api/tests/runs", (req, res) => {
    assertObject(req.body, "body");

    const total = req.body.total;
    const passed = req.body.passed;
    const failed = req.body.failed;

    assertInteger(total, "total", { min: 0 });
    assertInteger(passed, "passed", { min: 0 });
    assertInteger(failed, "failed", { min: 0 });

    if (passed + failed > total) {
      throw new AppError("'passed + failed' cannot exceed 'total'", 422, "VALIDATION_ERROR");
    }

    const run = store.createTestRun({
      tool: assertString(req.body.tool, "tool", { allowed: ["playwright", "cypress", "k6"] }),
      environmentId: assertString(req.body.environmentId, "environmentId"),
      total,
      passed,
      failed,
      durationMs: Number(req.body.durationMs ?? 0),
      coverage: Number(req.body.coverage ?? 0)
    });

    res.status(201).json(run);
  });

  app.post("/api/quality/risk", (req, res) => {
    assertObject(req.body, "body");

    const version = assertString(req.body.version ?? "unknown", "version");
    const passRate = Number(req.body.passRate);
    const coverage = Number(req.body.coverage);
    const failedTests = Number(req.body.failedTests);
    const buildStability = Number(req.body.buildStability);

    assertNumber(passRate, "passRate", { min: 0, max: 100 });
    assertNumber(coverage, "coverage", { min: 0, max: 100 });
    assertInteger(failedTests, "failedTests", { min: 0 });
    assertNumber(buildStability, "buildStability", { min: 0, max: 100 });

    const report = store.updateRiskReport({
      version,
      passRate,
      coverage,
      failedTests,
      buildStability
    });

    res.json(report);
  });

  app.get("/api/metrics/dashboard", (_req, res) => {
    res.json(store.getDashboardMetrics());
  });

  app.get("/api/observability", (_req, res) => {
    res.json({
      grafana: "/monitoring/grafana",
      prometheus: "/monitoring/prometheus",
      loki: "/monitoring/loki",
      jaeger: "/monitoring/jaeger"
    });
  });

  app.use((err, _req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message,
          details: err.details
        }
      });
    }

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error"
      }
    });
  });

  return app;
}
