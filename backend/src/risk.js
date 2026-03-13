const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function calculateReleaseRisk({ passRate, coverage, failedTests, buildStability }) {
  let score = 0;

  if (passRate < 95) score += 1;
  if (passRate < 90) score += 1;
  if (passRate < 80) score += 1;

  if (coverage < 85) score += 1;
  if (coverage < 75) score += 1;

  if (failedTests >= 3) score += 1;
  if (failedTests >= 8) score += 1;

  if (buildStability < 90) score += 1;
  if (buildStability < 80) score += 1;

  if (score <= 1) return RISK_LEVELS[0];
  if (score <= 3) return RISK_LEVELS[1];
  if (score <= 6) return RISK_LEVELS[2];
  return RISK_LEVELS[3];
}
