import { Router } from "express";
import { createId, store, timestamp } from "../data/store.js";

const router = Router();

router.get("/runs", (_req, res) => {
  res.json({ items: store.testRuns });
});

router.post("/runs", (req, res) => {
  const {
    suite,
    tool,
    environment,
    passRate,
    failedTests = 0,
    durationSec = 0
  } = req.body ?? {};

  if (!suite || !tool || !environment || typeof passRate !== "number") {
    return res.status(400).json({
      message: "suite, tool, environment and numeric passRate are required"
    });
  }

  const testRun = {
    id: createId("test-run"),
    suite,
    tool,
    environment,
    passRate,
    failedTests,
    durationSec,
    status: passRate >= 90 ? "PASSED" : "FAILED",
    executedAt: timestamp()
  };

  store.testRuns.unshift(testRun);
  res.status(201).json(testRun);
});

export default router;
