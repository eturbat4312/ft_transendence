FROM python:3.9 as base

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/django

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y postgresql-client

COPY ./requirements.txt /app/django/requirements.txt

RUN pip install -r requirements.txt

COPY . /app/django

# Copy the entrypoint script into the image
COPY ./entrypoint.sh /app/django/entrypoint.sh
RUN chmod +x /app/django/entrypoint.sh

EXPOSE 8000

CMD ["/app/django/entrypoint.sh"]
