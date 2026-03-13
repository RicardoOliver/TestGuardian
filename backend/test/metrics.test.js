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

test("health endpoint returns ok status", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });
});

test("exposes and updates custom Prometheus metrics", async () => {
  await withServer(async (baseUrl) => {
    const updates = [
      ["test-pass-rate", 0.92],
      ["release-risk", 0.34],
      ["defect-density", 0.11],
      ["pipeline-health", 0.88]
    ];

    for (const [path, value] of updates) {
      const response = await fetch(`${baseUrl}/metrics/${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value })
      });

      assert.equal(response.status, 204);
    }

    const metricsResponse = await fetch(`${baseUrl}/metrics`);
    assert.equal(metricsResponse.status, 200);
    const payload = await metricsResponse.text();

    assert.match(payload, /# HELP qa_test_pass_rate QA test pass rate/);
    assert.match(payload, /qa_test_pass_rate 0.92/);
    assert.match(payload, /qa_release_risk_score 0.34/);
    assert.match(payload, /qa_defect_density 0.11/);
    assert.match(payload, /qa_pipeline_health 0.88/);
    assert.match(payload, /process_cpu_seconds_total/);
    assert.match(payload, /process_resident_memory_bytes/);
  });
});
