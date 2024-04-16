#!/bin/bash

  # Color
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  GREY='\033[1;37m'
  NC='\033[0m'

  # Variables
  ENV_PATH=.env

  SECRET_KEY='django-insecure-rmg-2_m8-mq=!fw8osm^@&_z60)gj4rw3%qh&(#o*2kaq&a9mj'
  DB_HOST=db
  DB_PORT=5432
  DB_NAME=postgres
  DB_USER=postgres
  PROMETHEUS_USERNAME=admin
  DEBUG=False

docker exec postgres apt-get update && apt-get install -y postgresql-13-pg-prometheus  


  # Catch if ctrl+c is pressed
  trap ctrl_c INT
  function ctrl_c() {
    echo -e "\n${RED}Exiting${NC}"
    exit 1
  }

  # Check if .env file exists in project
  if [ -f "$ENV_PATH" ]; then
    echo -e "${YELLOW}.env file already exists${NC}"
    # ask if user wants to overwrite¨
    read -p "Do you want to overwrite it? [y/n] " -n 1 -r
    # if yes, overwrite
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "\n\nOverwriting .env file"
      rm $ENV_PATH
    # if no, exit
    else
      echo -e "\n${RED}Exiting${NC}"
      exit 1
    fi
  fi

  # Fill .env variables with prompt input

  echo -e "\n${GREY}Enter your database password:${NC}"
  read -r POSTGRES_PASSWORD

  echo "Enter your Prometheus password:"
  read -r PROMETHEUS_PASSWORD

  PROMETHEUS_HASH=$(htpasswd -nbBC 10 "$PROMETHEUS_USERNAME" "$PROMETHEUS_PASSWORD" | awk -F":" '{print $2}')


  # if .env not filled exit
  if [ -z "$SECRET_KEY" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]  ||
    [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$PROMETHEUS_PASSWORD" ] ||
    [ -z "$PROMETHEUS_USERNAME" ]|| [ -z "$PROMETHEUS_HASH" ]|| [ -z "$DEBUG" ] ; then

    echo -e "\n${RED}Error: .env file not filled${NC}"
    exit 1
  else
    # if .env filled, create .env file
    echo -e "SECRET_KEY=$SECRET_KEY" >> $ENV_PATH
    echo -e "DB_HOST=$DB_HOST" >> $ENV_PATH
    echo -e "DB_PORT=$DB_PORT" >> $ENV_PATH
    echo -e "DB_NAME=$DB_NAME" >> $ENV_PATH
    echo -e "DB_USER=$DB_USER" >> $ENV_PATH
    echo -e "PROMETHEUS_USERNAME=$PROMETHEUS_USERNAME" >> $ENV_PATH
    echo -e "DEBUG=$DEBUG" >> $ENV_PATH
    echo -e "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> $ENV_PATH
    echo -e "PROMETHEUS_PASSWORD=$PROMETHEUS_PASSWORD" >> $ENV_PATH
    echo -e "DATA_SOURCE_NAME=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/postgres?sslmode=disable" >> $ENV_PATH
    echo -e "PROMETHEUS_HASH=$PROMETHEUS_HASH" >> $ENV_PATH
    export $(grep -v '^#' .env | xargs) 
    sed 's/${PROMETHEUS_PASSWORD}/'"$PROMETHEUS_PASSWORD"'/' prometheus.template.yml > prom.yml
    sed 's#${PROMETHEUS_HASH}#'"$PROMETHEUS_HASH"'#' web.template.yml > web.yml
    mv prom.yml ./src/app/prometheus/prometheus.yml
    mv web.yml ./src/app/prometheus/config/web.yml

    # Success message
    echo -e "\n${GREEN}Success!${NC} .env file created"
  fi
