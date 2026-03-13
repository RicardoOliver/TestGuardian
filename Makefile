.PHONY: dev test deploy prod

dev:
	@./scripts/dev.sh

test:
	@./scripts/test.sh

deploy:
	@./scripts/deploy.sh

prod:
	@./scripts/prod.sh
