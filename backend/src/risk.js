const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function scoreFromBands(value, bands) {
  return bands.reduce((acc, band) => (value < band.threshold ? acc + band.weight : acc), 0);
}

export function calculateReleaseRiskReport({ passRate, coverage, failedTests, buildStability }) {
  let score = 0;
  const reasons = [];

  const passRateScore = scoreFromBands(passRate, [
    { threshold: 95, weight: 1 },
    { threshold: 90, weight: 1 },
    { threshold: 80, weight: 1 }
  ]);
  score += passRateScore;
  if (passRateScore > 0) reasons.push("Pass rate below target");

  const coverageScore = scoreFromBands(coverage, [
    { threshold: 85, weight: 1 },
    { threshold: 75, weight: 1 }
  ]);
  score += coverageScore;
  if (coverageScore > 0) reasons.push("Coverage below target");

  if (failedTests >= 3) {
    score += 1;
    reasons.push("At least 3 failed tests");
  }

  if (failedTests >= 8) {
    score += 1;
    reasons.push("High failed test count");
  }

  if (buildStability < 90) {
    score += 1;
    reasons.push("Build stability below 90%");
  }

  if (buildStability < 80) {
    score += 1;
    reasons.push("Build stability below 80%");
  }

  let level = RISK_LEVELS[3];
  if (score <= 1) {
    level = RISK_LEVELS[0];
  } else if (score <= 3) {
    level = RISK_LEVELS[1];
  } else if (score <= 6) {
    level = RISK_LEVELS[2];
  }

  return {
    level,
    score,
    reasons
  };
}

export function calculateReleaseRisk(metrics) {
  return calculateReleaseRiskReport(metrics).level;
}
