# Frontend Dashboard (Next.js)

Production-style dashboard implemented with **Next.js + TailwindCSS**.

## Modules
- Environment overview (DEV, QA, UAT, PROD and PREVIEW)
- Pipeline timeline and stage status summary
- Quality intelligence cards (risk, pass rate, coverage, stability)
- Observability quick links (Grafana, Loki, Jaeger, Prometheus)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

By default it expects backend API at `http://localhost:4000`.
Set `NEXT_PUBLIC_API_BASE_URL` to customize.
