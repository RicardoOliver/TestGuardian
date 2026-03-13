import { Gauge, Registry, collectDefaultMetrics } from "prom-client";
import { AppError } from "./errors.js";

const register = new Registry();
collectDefaultMetrics({ register });

const qaTestPassRate = new Gauge({
  name: "qa_test_pass_rate",
  help: "QA test pass rate",
  registers: [register]
});

const qaReleaseRiskScore = new Gauge({
  name: "qa_release_risk_score",
  help: "QA release risk score",
  registers: [register]
});

const qaDefectDensity = new Gauge({
  name: "qa_defect_density",
  help: "QA defect density",
  registers: [register]
});

const qaPipelineHealth = new Gauge({
  name: "qa_pipeline_health",
  help: "QA pipeline health",
  registers: [register]
});

qaTestPassRate.set(0);
qaReleaseRiskScore.set(0);
qaDefectDensity.set(0);
qaPipelineHealth.set(0);

function assertMetricValue(value, metricName) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new AppError(`'value' for '${metricName}' must be a valid number`, 422, "VALIDATION_ERROR");
  }

  return numericValue;
}

export const metricsStore = {
  register,
  setTestPassRate(value) {
    qaTestPassRate.set(assertMetricValue(value, "qa_test_pass_rate"));
  },
  setReleaseRiskScore(value) {
    qaReleaseRiskScore.set(assertMetricValue(value, "qa_release_risk_score"));
  },
  setDefectDensity(value) {
    qaDefectDensity.set(assertMetricValue(value, "qa_defect_density"));
  },
  setPipelineHealth(value) {
    qaPipelineHealth.set(assertMetricValue(value, "qa_pipeline_health"));
  }
};
