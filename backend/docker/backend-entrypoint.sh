#!/bin/sh
set -e

if [ -n "${SQL_HOST}" ]; then
  echo "Waiting for PostgreSQL at ${SQL_HOST}:${SQL_PORT:-5432}..."
  python - <<'PY'
import os
import time
import psycopg2

host = os.getenv("SQL_HOST")
port = int(os.getenv("SQL_PORT", "5432"))
db = os.getenv("SQL_DATABASE")
user = os.getenv("SQL_USER")
password = os.getenv("SQL_PASSWORD")

for attempt in range(30):
    try:
        psycopg2.connect(host=host, port=port, dbname=db, user=user, password=password).close()
        print("PostgreSQL is ready.")
        break
    except Exception:
        time.sleep(1)
else:
    raise SystemExit("PostgreSQL did not become ready in time.")
PY
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn main.wsgi:application --bind 0.0.0.0:8000 --workers 3
