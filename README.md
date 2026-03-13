# TestGuardian Platform

Cloud-native platform for **QA Engineering, DevOps automation, and software quality monitoring**.

The platform simulates how modern engineering teams manage environments, pipelines, automated tests, and quality metrics across the software delivery lifecycle.

---

## Architecture Overview

The platform follows a **cloud-native microservices architecture** designed to support scalable CI/CD pipelines and automated quality analysis.

```text
Users
   │
   ▼
Frontend Dashboard (Next.js)
   │
   ▼
API Gateway
   │
   ▼
Backend Services
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

The platform supports multiple environments following a modern delivery workflow.

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

The platform automatically creates **temporary environments for Pull Requests**.

Example:

```text
preview-pr-101
preview-pr-102
preview-pr-103
```

Workflow:

```text
Pull Request
      │
      ▼
CI/CD Pipeline
      │
      ▼
Create Kubernetes Namespace
      │
      ▼
Deploy Application
      │
      ▼
Run Automated Tests
      │
      ▼
QA Validation
```

Preview environments are destroyed automatically when the Pull Request is closed.

---

## Core Features

- Environment management
- Automated testing
- CI/CD pipeline monitoring
- Release risk analysis
- Preview environments
- Observability dashboards

---

## Quality Intelligence

The platform includes an **AI-based quality analysis module** that evaluates release risk based on test metrics.

Example output:

```text
Release Version: 1.2.0

Test Pass Rate: 91%
Coverage: 82%
Failed Tests: 3

Release Risk Score: MEDIUM
```

Risk classification:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

## Metrics Dashboard

Key metrics displayed:

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

### Infrastructure

- Docker
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
qaops-platform/
├── backend/
├── frontend/
├── services/
├── tests/
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

- Docker
- Kubernetes
- kubectl
- Node.js

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

---

## CI/CD Pipeline

Pipeline flow:

```text
Developer Commit
       │
       ▼
Build
       │
       ▼
Unit Tests
       │
       ▼
Security Scan
       │
       ▼
Build Docker Image
       │
       ▼
Push Container Registry
       │
       ▼
Deploy DEV
       │
       ▼
Automated Tests
       │
       ▼
Deploy QA
       │
       ▼
Performance Tests
       │
       ▼
Deploy UAT
       │
       ▼
Manual Approval
       │
       ▼
Deploy Production
```

---

## Observability

Monitoring stack:

```text
Application
   │
   ▼
Metrics
   │
   ▼
Prometheus
   │
   ▼
Grafana Dashboards
```

Logs and tracing:

- Loki
- Jaeger

---

## Future Improvements

- AI-powered test failure analysis
- Automatic regression detection
- Intelligent release risk prediction
- Multi-tenant SaaS architecture

---

## License

MIT License

---

## Author

Ricardo Oliveira  
QA Engineer | DevOps Enthusiast | Software Quality Advocate


## Resolução de conflitos de PR

Se um PR ficar bloqueado por conflitos com `main`, use:

```bash
./scripts/resolve-pr-conflicts.sh main
```

O script tenta fazer o merge da base e aplica resolução automática nos arquivos mais recorrentes do projeto; se restarem conflitos, ele lista os arquivos para ajuste manual.

