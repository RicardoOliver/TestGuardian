import express from "express";
import { calculateReleaseRisk } from "./risk.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "qaops-api",
    status: "ok"
  });
});

app.post("/api/quality/risk", (req, res) => {
  const {
    version = "unknown",
    passRate = 0,
    coverage = 0,
    failedTests = 0,
    buildStability = 0
  } = req.body ?? {};

  const risk = calculateReleaseRisk({
    passRate,
    coverage,
    failedTests,
    buildStability
  });

  res.json({
    releaseVersion: version,
    metrics: {
      passRate,
      coverage,
      failedTests,
      buildStability
    },
    releaseRiskScore: risk
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`QAOps backend listening on port ${port}`);
});
