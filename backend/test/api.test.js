import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function withServer(run) {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

test("creates preview environment and computes dashboard metrics", async () => {
  await withServer(async (baseUrl) => {
    const provision = await fetch(`${baseUrl}/api/preview/101/provision`, { method: "POST" });
    assert.equal(provision.status, 201);
    const preview = await provision.json();
    assert.equal(preview.name, "preview-pr-101");

    const pipelineResponse = await fetch(`${baseUrl}/api/pipelines`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        environmentId: preview.id,
        commitSha: "1234567abcde"
      })
    });
    assert.equal(pipelineResponse.status, 201);
    const pipeline = await pipelineResponse.json();

    const stageUpdate = await fetch(
      `${baseUrl}/api/pipelines/${pipeline.id}/stages/${encodeURIComponent("Build")}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "PASSED" })
      }
    );
    assert.equal(stageUpdate.status, 200);

    const runResponse = await fetch(`${baseUrl}/api/tests/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tool: "playwright",
        environmentId: preview.id,
        total: 100,
        passed: 97,
        failed: 3,
        durationMs: 42000,
        coverage: 84
      })
    });
    assert.equal(runResponse.status, 201);

    const riskResponse = await fetch(`${baseUrl}/api/quality/risk`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        version: "1.2.0",
        passRate: 91,
        coverage: 82,
        failedTests: 3,
        buildStability: 92
      })
    });
    assert.equal(riskResponse.status, 200);
    const risk = await riskResponse.json();
    assert.equal(risk.releaseRiskScore, "MEDIUM");

    const metricsResponse = await fetch(`${baseUrl}/api/metrics/dashboard`);
    assert.equal(metricsResponse.status, 200);
    const metrics = await metricsResponse.json();

    assert.equal(metrics.testPassRate, 97);
    assert.equal(metrics.automationCoverage, 84);
    assert.equal(metrics.releaseRiskScore, "MEDIUM");
  });
});

test("rejects invalid test run payload", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tests/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tool: "playwright",
        environmentId: "env-1",
        total: 10,
        passed: 9,
        failed: 5,
        coverage: 80
      })
    });

    assert.equal(response.status, 422);
    const payload = await response.json();
    assert.equal(payload.error.code, "VALIDATION_ERROR");
  });
});
