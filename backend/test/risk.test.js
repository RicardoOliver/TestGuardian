import test from "node:test";
import assert from "node:assert/strict";
import { calculateReleaseRisk } from "../src/risk.js";

test("classifies low risk release", () => {
  const risk = calculateReleaseRisk({
    passRate: 98,
    coverage: 90,
    failedTests: 0,
    buildStability: 97
  });

  assert.equal(risk, "LOW");
});

test("classifies medium risk release", () => {
  const risk = calculateReleaseRisk({
    passRate: 92,
    coverage: 82,
    failedTests: 3,
    buildStability: 92
  });

  assert.equal(risk, "MEDIUM");
});

test("classifies high risk release", () => {
  const risk = calculateReleaseRisk({
    passRate: 86,
    coverage: 74,
    failedTests: 5,
    buildStability: 85
  });

  assert.equal(risk, "HIGH");
});

test("classifies critical risk release", () => {
  const risk = calculateReleaseRisk({
    passRate: 70,
    coverage: 65,
    failedTests: 12,
    buildStability: 60
  });

  assert.equal(risk, "CRITICAL");
});
