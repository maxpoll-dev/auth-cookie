COMPOSE := docker compose

.PHONY: up down seed

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down -v

seed:
	$(COMPOSE) run --build --rm api-seed