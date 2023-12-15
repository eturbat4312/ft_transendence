FROM python:3

ENV PYTHONUNBUFFERED 1

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/web

COPY ./backend/ /app/web/

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt

RUN pip install django-bootstrap-v5

ENTRYPOINT  ["./entrypoint.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]