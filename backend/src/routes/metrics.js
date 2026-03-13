import { Router } from "express";

export function createMetricsRouter(metricsStore) {
  const router = Router();

  router.get("/metrics", async (_req, res) => {
    res.set("Content-Type", metricsStore.register.contentType);
    res.end(await metricsStore.register.metrics());
  });

  router.post("/metrics/test-pass-rate", (req, res) => {
    metricsStore.setTestPassRate(req.body.value);
    res.status(204).send();
  });

  router.post("/metrics/release-risk", (req, res) => {
    metricsStore.setReleaseRiskScore(req.body.value);
    res.status(204).send();
  });

  router.post("/metrics/defect-density", (req, res) => {
    metricsStore.setDefectDensity(req.body.value);
    res.status(204).send();
  });

  router.post("/metrics/pipeline-health", (req, res) => {
    metricsStore.setPipelineHealth(req.body.value);
    res.status(204).send();
  });

  return router;
}
