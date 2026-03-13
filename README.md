# TestGuardian Platform

Cloud-native platform for **QA Engineering, DevOps automation, and software quality monitoring**.

The platform simulates how modern engineering teams manage environments, pipelines, automated tests, and quality metrics across the software delivery lifecycle.

---

## Architecture Overview

```text
Users
   │
   ▼
Frontend Dashboard (Next.js)
   │
   ▼
API Gateway (Nginx)
   │
   ▼
Backend Services (Node.js/Express)
   │
   ├ Environment Service
   ├ Pipeline Service
   ├ Test Automation Service
   └ AI Quality Service
   │
   ▼
Database (PostgreSQL)
   │
   ▼
Observability Stack
   ├ Prometheus
   ├ Grafana
   ├ Loki
   └ Jaeger
```

---

## Environments

| Environment | Purpose                          | Stability | Data                       |
| ----------- | -------------------------------- | --------- | -------------------------- |
| DEV         | Development and experimentation  | Low       | Mock data                  |
| QA          | Automated testing and validation | Medium    | Test datasets              |
| UAT         | Business validation              | High      | Anonymized production data |
| PROD        | Live system                      | Very High | Production data            |

Workflow:

```text
DEV → QA → UAT → PRODUCTION
```

---

## Preview Environments

Preview environments follow `preview-pr-<number>` and are provisioned/destroyed by API endpoints:

- `POST /api/preview/:prNumber/provision`
- `DELETE /api/preview/:prNumber`

---

## Core Features (implemented)

- Environment management
- Automated testing ingestion
- CI/CD pipeline monitoring
- Release risk analysis
- Preview environments
- Observability quick links and dashboards

---

## Quality Intelligence

Risk classification:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Main endpoint:

- `POST /api/quality/risk`

Input metrics:
- Pass rate
- Coverage
- Failed tests
- Build stability

Output:
- Risk level
- Numeric score
- Explainable reasons

---

## Metrics Dashboard

Frontend dashboard and API expose:

- Test Pass Rate
- Automation Coverage
- Defect Density
- Release Risk Score
- Build Stability

---

## Tech Stack

### Frontend
- Next.js
- TailwindCSS

### Backend
- Node.js
- Express

### Testing
- Playwright
- Cypress
- k6
- Node test runner

### Infrastructure
- Docker / Docker Compose
- Kubernetes
- Terraform

### CI/CD
- GitHub Actions
- ArgoCD

### Observability
- Prometheus
- Grafana
- Loki
- Jaeger

---

## Repository Structure

```text
TestGuardian/
├── backend/
├── frontend/
├── services/
├── tests/
│   ├── e2e/
│   ├── component/
│   └── load/
├── docker/
├── k8s/
├── terraform/
├── monitoring/
├── dashboards/
├── scripts/
├── docs/
├── .github/workflows/
├── Makefile
└── README.md
```

---

## Running the Project Locally

### Prerequisites

- Docker + Docker Compose
- Kubernetes + kubectl (for cluster deployment)
- Node.js 20+

### Start Development Environment

```bash
make dev
```

### Run Automated Tests

```bash
make test
```

### Deploy to Kubernetes

```bash
make deploy
```

### Deploy Production

```bash
make prod
```
