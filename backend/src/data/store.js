import { DEFAULT_ENVIRONMENTS } from "../config/environments.js";

const now = () => new Date().toISOString();

const previewEnvironments = [
  {
    id: "preview-pr-101",
    pullRequest: 101,
    namespace: "preview-pr-101",
    status: "READY",
    createdAt: now()
  },
  {
    id: "preview-pr-102",
    pullRequest: 102,
    namespace: "preview-pr-102",
    status: "TESTING",
    createdAt: now()
  }
];

const pipelines = [
  {
    id: "pipe-1",
    branch: "main",
    commit: "abc1234",
    environment: "DEV",
    stages: ["Build", "Unit Tests", "Security Scan", "Deploy DEV"],
    status: "SUCCESS",
    startedAt: now(),
    completedAt: now()
  }
];

const testRuns = [
  {
    id: "test-run-1",
    suite: "e2e-smoke",
    tool: "Playwright",
    environment: "QA",
    passRate: 94,
    failedTests: 2,
    durationSec: 420,
    status: "PASSED",
    executedAt: now()
  }
];

export const store = {
  environments: structuredClone(DEFAULT_ENVIRONMENTS),
  previewEnvironments,
  pipelines,
  testRuns
};

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function timestamp() {
  return now();
}
