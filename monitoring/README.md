# Monitoring Stack

This folder contains runtime configuration for:
- **Prometheus** (`monitoring/prometheus/prometheus.yml`)
- **Grafana** (dashboard provisioning + JSON dashboards)
- **Loki** (`monitoring/loki/local-config.yaml`)
- **Jaeger** (started from docker-compose)

## Local startup

The full stack can be started with:

```bash
make dev
```
