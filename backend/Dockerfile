FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip wheel \
    && pip install --no-cache-dir "setuptools<81" \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn whitenoise

COPY . .

RUN chmod +x docker/backend-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./docker/backend-entrypoint.sh"]
