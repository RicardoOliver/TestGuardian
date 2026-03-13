import { Router } from "express";
import { createId, store, timestamp } from "../data/store.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ items: store.pipelines });
});

router.post("/", (req, res) => {
  const {
    branch,
    commit,
    environment,
    stages = [],
    status = "RUNNING"
  } = req.body ?? {};

  if (!branch || !commit || !environment) {
    return res.status(400).json({ message: "branch, commit and environment are required" });
  }

  const pipeline = {
    id: createId("pipe"),
    branch,
    commit,
    environment,
    stages,
    status,
    startedAt: timestamp(),
    completedAt: status === "RUNNING" ? null : timestamp()
  };

  store.pipelines.unshift(pipeline);
  res.status(201).json(pipeline);
});

export default router;
