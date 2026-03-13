# Backend Services

Service boundaries and responsibilities:

- `environment/`: lifecycle and metadata of DEV/QA/UAT/PROD/PREVIEW environments
- `pipeline/`: CI/CD execution and stage transitions
- `test-automation/`: orchestrates and ingests Playwright/Cypress/k6 runs
- `ai-quality/`: computes release risk and quality gate decisions

The current backend API exposes these domains through dedicated routes.
