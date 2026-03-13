import { notFound, AppError } from "./errors.js";
import { calculateReleaseRiskReport } from "./risk.js";

const ENV_TYPES = ["DEV", "QA", "UAT", "PROD", "PREVIEW"];
const STAGE_STATUS = ["PENDING", "RUNNING", "PASSED", "FAILED", "CANCELLED"];
const RUN_STATUS = ["QUEUED", "RUNNING", "PASSED", "FAILED"];

function nowIso() {
  return new Date().toISOString();
}

export class PlatformStore {
  constructor() {
    this.environments = new Map();
    this.pipelines = new Map();
    this.testRuns = new Map();
    this.lastRiskReport = null;

    this.counters = {
      environment: 0,
      pipeline: 0,
      run: 0
    };

    this.seed();
  }

  seed() {
    [
      { name: "development", type: "DEV", stability: "Low", dataProfile: "Mock data" },
      { name: "qa", type: "QA", stability: "Medium", dataProfile: "Test datasets" },
      { name: "uat", type: "UAT", stability: "High", dataProfile: "Anonymized production data" },
      { name: "production", type: "PROD", stability: "Very High", dataProfile: "Production data" }
    ].forEach((env) => this.createEnvironment(env));
  }

  createEnvironment({ name, type, stability, dataProfile, preview = false, prNumber, ttlHours = 72 }) {
    if (!ENV_TYPES.includes(type)) {
      throw new AppError(`Unknown environment type '${type}'`, 422, "VALIDATION_ERROR");
    }

    const id = `env-${++this.counters.environment}`;
    const createdAt = nowIso();

    const environment = {
      id,
      name,
      type,
      stability,
      dataProfile,
      status: "ACTIVE",
      preview,
      prNumber: prNumber ?? null,
      ttlHours: preview ? ttlHours : null,
      createdAt,
      updatedAt: createdAt
    };

    this.environments.set(id, environment);
    return environment;
  }

  listEnvironments({ type }) {
    const all = [...this.environments.values()];
    if (!type) return all;
    return all.filter((env) => env.type === type);
  }

  getEnvironment(id) {
    return this.environments.get(id) ?? null;
  }

  updateEnvironmentStatus(id, status) {
    const environment = this.environments.get(id);
    if (!environment) {
      throw notFound(`Environment '${id}' not found`);
    }

    environment.status = status;
    environment.updatedAt = nowIso();
    return environment;
  }

  provisionPreview(prNumber) {
    const existing = [...this.environments.values()].find(
      (env) => env.preview && env.prNumber === prNumber && env.status !== "DESTROYED"
    );

    if (existing) {
      return existing;
    }

    return this.createEnvironment({
      name: `preview-pr-${prNumber}`,
      type: "PREVIEW",
      stability: "Temporary",
      dataProfile: "Isolated PR data",
      preview: true,
      prNumber,
      ttlHours: 72
    });
  }

  destroyPreview(prNumber) {
    const environment = [...this.environments.values()].find(
      (env) => env.preview && env.prNumber === prNumber && env.status !== "DESTROYED"
    );

    if (!environment) {
      throw notFound(`Preview environment for PR '${prNumber}' not found`);
    }

    environment.status = "DESTROYED";
    environment.updatedAt = nowIso();
    return environment;
  }

  createPipeline({ environmentId, commitSha, stages }) {
    if (!this.environments.has(environmentId)) {
      throw notFound(`Environment '${environmentId}' not found`);
    }

    const id = `pipe-${++this.counters.pipeline}`;
    const createdAt = nowIso();

    const pipeline = {
      id,
      environmentId,
      commitSha,
      status: "RUNNING",
      stages: stages.map((stage) => ({ name: stage, status: "PENDING", updatedAt: createdAt })),
      createdAt,
      updatedAt: createdAt
    };

    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  listPipelines() {
    return [...this.pipelines.values()];
  }

  updatePipelineStage({ pipelineId, stageName, status }) {
    if (!STAGE_STATUS.includes(status)) {
      throw new AppError(`Unknown stage status '${status}'`, 422, "VALIDATION_ERROR");
    }

    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw notFound(`Pipeline '${pipelineId}' not found`);
    }

    const stage = pipeline.stages.find((item) => item.name === stageName);
    if (!stage) {
      throw notFound(`Stage '${stageName}' not found in pipeline '${pipelineId}'`);
    }

    stage.status = status;
    stage.updatedAt = nowIso();
    pipeline.updatedAt = stage.updatedAt;

    const statuses = pipeline.stages.map((item) => item.status);
    if (statuses.every((s) => s === "PASSED")) {
      pipeline.status = "PASSED";
    } else if (statuses.some((s) => s === "FAILED")) {
      pipeline.status = "FAILED";
    } else if (statuses.some((s) => s === "RUNNING")) {
      pipeline.status = "RUNNING";
    }

    return pipeline;
  }

  createTestRun({ tool, environmentId, total, passed, failed, durationMs, coverage }) {
    if (!this.environments.has(environmentId)) {
      throw notFound(`Environment '${environmentId}' not found`);
    }

    const id = `run-${++this.counters.run}`;
    const createdAt = nowIso();

    let status = "FAILED";
    if (failed === 0) {
      status = "PASSED";
    } else if (passed === 0 && failed === 0) {
      status = "QUEUED";
    }

    if (!RUN_STATUS.includes(status)) {
      throw new AppError(`Unknown run status '${status}'`, 422, "VALIDATION_ERROR");
    }

    const run = {
      id,
      tool,
      environmentId,
      total,
      passed,
      failed,
      durationMs,
      coverage,
      status,
      createdAt
    };

    this.testRuns.set(id, run);
    return run;
  }

  listTestRuns() {
    return [...this.testRuns.values()];
  }

  updateRiskReport({ version, passRate, coverage, failedTests, buildStability }) {
    const report = calculateReleaseRiskReport({ passRate, coverage, failedTests, buildStability });
    this.lastRiskReport = {
      releaseVersion: version,
      metrics: {
        passRate,
        coverage,
        failedTests,
        buildStability
      },
      releaseRiskScore: report.level,
      score: report.score,
      reasons: report.reasons,
      evaluatedAt: nowIso()
    };

    return this.lastRiskReport;
  }

  getDashboardMetrics() {
    const runs = this.listTestRuns();
    const pipelines = this.listPipelines();

    const totalPassed = runs.reduce((acc, run) => acc + run.passed, 0);
    const totalTests = runs.reduce((acc, run) => acc + run.total, 0);
    const passRate = totalTests === 0 ? 0 : Number(((totalPassed / totalTests) * 100).toFixed(2));

    const averageCoverage = runs.length
      ? Number((runs.reduce((acc, run) => acc + run.coverage, 0) / runs.length).toFixed(2))
      : 0;

    const failedRuns = runs.filter((run) => run.failed > 0).length;
    const defectDensity = totalTests === 0 ? 0 : Number(((failedRuns / totalTests) * 100).toFixed(2));

    const stableBuilds = pipelines.filter((pipeline) => pipeline.status === "PASSED").length;
    const buildStability = pipelines.length
      ? Number(((stableBuilds / pipelines.length) * 100).toFixed(2))
      : 0;

    return {
      testPassRate: passRate,
      automationCoverage: averageCoverage,
      defectDensity,
      releaseRiskScore: this.lastRiskReport?.releaseRiskScore ?? "UNKNOWN",
      buildStability
    };
  }
}
