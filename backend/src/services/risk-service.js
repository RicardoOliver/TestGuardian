import { RISK_LEVELS, RISK_WEIGHTS } from "../config/risk-thresholds.js";

function applyThresholds(value, rules) {
  return rules.reduce((score, rule) => {
    const direction = rule.direction ?? "lt";
    const hit = direction === "gte" ? value >= rule.threshold : value < rule.threshold;
    return hit ? score + rule.weight : score;
  }, 0);
}

export function calculateReleaseRisk({ passRate, coverage, failedTests, buildStability }) {
  const score =
    applyThresholds(passRate, RISK_WEIGHTS.passRate) +
    applyThresholds(coverage, RISK_WEIGHTS.coverage) +
    applyThresholds(failedTests, RISK_WEIGHTS.failedTests) +
    applyThresholds(buildStability, RISK_WEIGHTS.buildStability);

  if (score <= 1) return { level: RISK_LEVELS[0], score };
  if (score <= 3) return { level: RISK_LEVELS[1], score };
  if (score <= 6) return { level: RISK_LEVELS[2], score };
  return { level: RISK_LEVELS[3], score };
}

export function computeQualitySnapshot(testRuns) {
  if (!testRuns.length) {
    return {
      testPassRate: 0,
      automationCoverage: 0,
      defectDensity: 0,
      buildStability: 0
    };
  }

  const passRateSum = testRuns.reduce((acc, run) => acc + run.passRate, 0);
  const failedSum = testRuns.reduce((acc, run) => acc + run.failedTests, 0);
  const stableRuns = testRuns.filter((run) => run.status === "PASSED").length;

  return {
    testPassRate: Number((passRateSum / testRuns.length).toFixed(2)),
    automationCoverage: Number((70 + testRuns.length * 2).toFixed(2)),
    defectDensity: Number((failedSum / Math.max(testRuns.length, 1)).toFixed(2)),
    buildStability: Number(((stableRuns / testRuns.length) * 100).toFixed(2))
  };
}
