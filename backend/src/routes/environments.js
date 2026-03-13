import { Router } from "express";
import { DELIVERY_FLOW } from "../config/environments.js";
import { createId, store, timestamp } from "../data/store.js";
import { ensureEnum } from "../utils/validators.js";
import { notFound } from "../utils/http-errors.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ flow: DELIVERY_FLOW, environments: store.environments });
});

router.get("/preview", (_req, res) => {
  res.json({ items: store.previewEnvironments });
});

router.post("/preview", (req, res) => {
  const { pullRequest } = req.body ?? {};
  if (!Number.isInteger(pullRequest) || pullRequest <= 0) {
    throw new Error("pullRequest must be a positive integer");
  }

  const namespace = `preview-pr-${pullRequest}`;
  const preview = {
    id: createId("preview"),
    pullRequest,
    namespace,
    status: "CREATING",
    createdAt: timestamp()
  };

  store.previewEnvironments.push(preview);
  res.status(201).json(preview);
});

router.patch("/:name/status", (req, res) => {
  const { name } = req.params;
  const { status } = req.body ?? {};

  ensureEnum(status, ["ACTIVE", "MAINTENANCE", "DEGRADED"], "status");
  const environment = store.environments.find((item) => item.name === name.toUpperCase());

  if (!environment) {
    throw notFound(`Environment ${name} not found`);
  }

  environment.status = status;
  res.json(environment);
});

export default router;
