FROM python:3.9.18-slim-bullseye as base

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1s
ENV PYTHONUNBUFFERED 1

WORKDIR /app/django

RUN pip install --upgrade pip

COPY ./requirements.txt /app/django/requirements.txt

RUN pip install -r requirements.txt

RUN pip install django-bootstrap-v5

COPY . /app/django

EXPOSE 8000
ENTRYPOINT  ["./entrypoint.sh"]
