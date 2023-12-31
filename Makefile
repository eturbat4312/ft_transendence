
# COLORS
GREEN		= \033[1;32m
RED 		= \033[1;31m
ORANGE		= \033[1;33m
CYAN		= \033[1;36m

# VARIABLES
DOCKERCOMPOSE = docker-compose.yml
ENVSCRIPT = ./script/env.sh

all:
	@echo "${GREEN}Starting containers.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build

front:
	@echo "${GREEN}Starting front container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build front

django:
	@echo "${GREEN}Starting django container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build django

db:
	@echo "${GREEN}Starting db container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build db

down:
	@echo "${RED}Stopping containers.."
	@docker compose -f $(DOCKERCOMPOSE) down

clean:
	@echo "${ORANGE} Stoping and Removing containers images volumes networks.."
	@docker compose -f $(DOCKERCOMPOSE) down --rmi all -v --remove-orphans

re: down all
	@echo "${CYAN}Containers restarted.."

env: ## Create/Overwrite .env file
	@chmod +x $(ENVSCRIPT)
	@bash $(ENVSCRIPT)

.phony: front django db all down clean re env
