
# COLORS
GREEN		= \033[1;32m
RED 		= \033[1;31m
ORANGE		= \033[1;33m
CYAN		= \033[1;36m

# VARIABLES
DOCKERCOMPOSE = docker-compose.yml

front:
	@echo "${GREEN}Starting front container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build front

back:
	@echo "${GREEN}Starting back container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build backend

db:
	@echo "${GREEN}Starting db container.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build db

all:
	@echo "${GREEN}Starting containers.."
	@docker compose -f $(DOCKERCOMPOSE) up -d --build

down:
	@echo "${RED}Stopping containers.."
	@docker compose -f $(DOCKERCOMPOSE) down

clean:
	@echo "${ORANGE} Stoping and Removing containers images volumes networks.."
	@docker compose -f $(DOCKERCOMPOSE) down --rmi all -v --remove-orphans

re: clean all
	@echo "${CYAN}Containers restarted.."

.phony: front back db all down clean re
