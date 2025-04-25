# Makefile

up:
	docker-compose up -d --build

down:
	docker-compose down

down-vol:
	docker-compose down -v

restart: down up

logs:
	docker-compose logs -f node-app
