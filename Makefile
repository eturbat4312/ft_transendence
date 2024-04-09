# COLORS
GREEN       = \033[1;32m
RED         = \033[1;31m
ORANGE      = \033[1;33m
CYAN        = \033[1;36m
RESET       = \033[0m

# VARIABLES
DOCKERCOMPOSE = docker-compose.yml
ENVSCRIPT     = ./script/env.sh

# Make commands
all:
	@echo "${GREEN}Starting containers..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) up -d --build

front:
	@echo "${GREEN}Starting front container..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) up -d --build front

nginx:
	@echo "${GREEN}Starting nginx container..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) up -d --build nginx

django:
	@echo "${GREEN}Starting django container..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) up -d --build django

db:
	@echo "${GREEN}Starting db container..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) up -d --build db

down:
	@echo "${RED}Stopping containers..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) down

clean:
	@echo "${ORANGE}Stoping and Removing containers images volumes networks..${RESET}"
	@docker compose -f $(DOCKERCOMPOSE) down --rmi all -v --remove-orphans

re: down all
	@echo "${CYAN}Containers restarted..${RESET}"

env: ## Create/Overwrite .env file
	@chmod +x $(ENVSCRIPT)
	@bash $(ENVSCRIPT)

install-pg-prometheus:
	@echo "${GREEN}Installing pg_prometheus..${RESET}"
	@docker exec -it postgres /bin/bash -c "rm -rf /tmp/pg_prometheus && \
											git clone https://github.com/timescale/pg_prometheus.git /tmp/pg_prometheus && \
                                            cd /tmp/pg_prometheus && \
                                            make install && \
                                            make installcheck && \
                                            make clean"
.PHONY: all front nginx django db down clean re env install-pg-prometheus
