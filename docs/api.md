# QAOps API Guide

## Create preview environment

`POST /api/environments/preview`

```json
{
  "pullRequest": 103
}
```

## Create pipeline execution

`POST /api/pipelines`

```json
{
  "branch": "feature/qa-dashboard",
  "commit": "12ab34",
  "environment": "QA",
  "stages": ["Build", "Unit Tests", "Deploy QA"],
  "status": "RUNNING"
}
```

## Submit automated test run

`POST /api/test-automation/runs`

```json
{
  "suite": "smoke",
  "tool": "Playwright",
  "environment": "QA",
  "passRate": 95,
  "failedTests": 1,
  "durationSec": 210
}
```

## Evaluate release risk

`POST /api/quality/risk`

```json
{
  "version": "1.2.0",
  "passRate": 91,
  "coverage": 82,
  "failedTests": 3,
  "buildStability": 90
}
```
