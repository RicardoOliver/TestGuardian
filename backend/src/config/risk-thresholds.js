export const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const RISK_WEIGHTS = {
  passRate: [
    { threshold: 95, weight: 1 },
    { threshold: 90, weight: 1 },
    { threshold: 80, weight: 1 }
  ],
  coverage: [
    { threshold: 85, weight: 1 },
    { threshold: 75, weight: 1 }
  ],
  failedTests: [
    { threshold: 3, weight: 1, direction: "gte" },
    { threshold: 8, weight: 1, direction: "gte" }
  ],
  buildStability: [
    { threshold: 90, weight: 1 },
    { threshold: 80, weight: 1 }
  ]
};
