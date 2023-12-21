FROM python:3.12.1-bookworm as base

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/django

RUN pip install --upgrade pip

RUN pip install django-bootstrap-v5

COPY ./requirements.txt /app/django/requirements.txt

RUN pip install -r requirements.txt

COPY . /app/django

EXPOSE 8000
ENTRYPOINT  ["./entrypoint.sh"]

CMD ["python", "manage.py", "runserver"]
