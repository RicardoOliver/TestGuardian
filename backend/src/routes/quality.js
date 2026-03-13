import { Router } from "express";
import { store } from "../data/store.js";
import { calculateReleaseRisk, computeQualitySnapshot } from "../services/risk-service.js";
import { ensureNumber } from "../utils/validators.js";

const router = Router();

router.get("/dashboard", (_req, res) => {
  const metrics = computeQualitySnapshot(store.testRuns);
  const releaseRisk = calculateReleaseRisk({
    passRate: metrics.testPassRate,
    coverage: metrics.automationCoverage,
    failedTests: metrics.defectDensity,
    buildStability: metrics.buildStability
  });

  res.json({
    metrics,
    releaseRiskScore: releaseRisk.level,
    releaseRiskNumericScore: releaseRisk.score
  });
});

router.post("/risk", (req, res) => {
  const {
    version = "unknown",
    passRate = 0,
    coverage = 0,
    failedTests = 0,
    buildStability = 0
  } = req.body ?? {};

  ensureNumber(passRate, "passRate");
  ensureNumber(coverage, "coverage");
  ensureNumber(failedTests, "failedTests", 0, 1000);
  ensureNumber(buildStability, "buildStability");

  const risk = calculateReleaseRisk({
    passRate,
    coverage,
    failedTests,
    buildStability
  });

  res.json({
    releaseVersion: version,
    metrics: { passRate, coverage, failedTests, buildStability },
    releaseRiskScore: risk.level,
    releaseRiskNumericScore: risk.score
  });
});

export default router;
