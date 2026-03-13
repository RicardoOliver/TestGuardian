.DEFAULT_GOAL := help

.PHONY: help dev test deploy prod

help:
	@echo "Available targets:"
	@echo "  make dev     # Start local Docker stack"
	@echo "  make test    # Run backend tests and frontend smoke checks"
	@echo "  make deploy  # Apply Kubernetes manifests"
	@echo "  make prod    # Run production Docker Compose stack"

dev:
	@./scripts/dev.sh

test:
	@./scripts/test.sh

deploy:
	@./scripts/deploy.sh

prod:
	@./scripts/prod.sh
