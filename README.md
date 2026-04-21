<p align="center">
  <img src="https://img.shields.io/badge/Backend-Django%20REST-0C4B33?style=flat&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Container-Docker-2496ED?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Hosting-Render-46E3B7?style=flat&logo=render&logoColor=black" />
  <img src="https://img.shields.io/badge/DB%20Hosting-Neon-00E599?style=flat&logo=postgresql&logoColor=black" />
</p>

<h1 align="center">Flight App (Fullstack) ✈️</h1>

<p align="center">
Production-style flight reservation app with token auth, role-based access, staff management panel, and isolated <code>prod/staging</code> environments.
</p>

<div align="center">
  <h3>
    <a href="https://umitdev-flight-frontend.onrender.com">🖥️ Live Frontend</a>
    |
    <a href="https://umitdev-flight-backend.onrender.com/swagger/">📘 Swagger</a>
    |
    <a href="https://umitdev-flight-backend.onrender.com/redoc/">📗 Redoc</a>
  </h3>
</div>

<!-- GIF PLACEHOLDER: Put your gif file in repo root and update src path -->
<div align="center">
  <img src="./flight-app-demo.gif" alt="flight-app-demo" width="900"/>
</div>

## 📚 Navigation

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Local Setup](#-local-setup)
- [🐳 Docker Setup](#-docker-setup)
- [🌍 Environments](#-environments)
- [🔐 Environment Files](#-environment-files)
- [📡 Core API Endpoints](#-core-api-endpoints)
- [🧪 Smoke Test](#-smoke-test)
- [📬 Contact Information](#-contact-information)


## ✨ Overview

This project demonstrates a complete backend+frontend workflow:

- Django REST backend + React frontend in one monorepo
- Token-based auth and role-based permissions
- Staff CRUD operations for flights
- Reservation create/update/delete with multi-passenger support
- Real deployment with separated `production` and `staging` DB paths

## 🚀 Features

- User register/login/logout (`dj-rest-auth`)
- Profile and password change
- Flight list/detail
- Reservation CRUD
- Staff-only flight CRUD panel
- Staff and user reservation visibility rules
- Swagger/Redoc API docs
- Responsive UI

## 🏗️ Architecture

- `backend/` -> Django REST API
- `frontend/` -> React (Vite) UI
- `docker-compose.yml` -> local fullstack (`backend + frontend + postgres + redis`)
- Hosting:
  - Backend: Render Web Service
  - Frontend: Render Web Service
  - DB: Neon PostgreSQL

## 🛠️ Tech Stack

- Python 3.11
- Django 4.1.7
- Django REST Framework
- React + Vite
- PostgreSQL
- Docker / Docker Compose
- Gunicorn + WhiteNoise
- Render + Neon

## ⚡ Local Setup

Backend:

```bash
cd backend
source env311/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Local URLs:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:5173`

## 🐳 Docker Setup

```bash
docker compose up --build -d
docker compose ps
```

Note: If local PostgreSQL already uses `5432`, compose uses host `5433`.

## 🌍 Environments

Current mapping:

- **Production**
  - Frontend: `https://umitdev-flight-frontend.onrender.com`
  - Backend: `https://umitdev-flight-backend.onrender.com`
  - Neon branch: `production`
  - DB: `flight_app`

- **Staging**
  - Frontend: `https://umitdev-flight-frontend-staging.onrender.com`
  - Backend: `https://umitdev-flight-backend-staging.onrender.com`
  - Neon branch: `staging`
  - DB: `flight_app_staging`

## 🔐 Environment Files

- `.env.example` -> backend template
- `frontend/.env.example` -> frontend local template
- `frontend/.env.production.example` -> frontend production template

Rules:

- Commit only `*.example`
- Never commit real `.env` secrets

## 📡 Core API Endpoints

Auth:

- `POST /users/register/`
- `POST /users/auth/login/`
- `POST /users/auth/logout/`
- `GET /users/auth/user/`
- `POST /users/auth/password/change/`

Flight:

- `GET /flight/flights/`
- `POST /flight/flights/` (staff)
- `GET /flight/flights/{id}/`
- `PUT/PATCH/DELETE /flight/flights/{id}/` (staff)

Reservation:

- `GET /flight/reservations/` (auth)
- `POST /flight/reservations/` (auth)
- `GET /flight/reservations/{id}/` (auth + permission)
- `PUT/PATCH/DELETE /flight/reservations/{id}/` (auth + permission)

## 🧪 Smoke Test

Detailed runbooks:

- `DEPLOY_CHECKLIST.md`
- `SMOKE_TEST_CHECKLIST.md`
- `PROJECT_PROGRESS.md`

## 📬 Contact Information

I am always open to discussing new projects, creative ideas, or opportunities to be part of your visions.

* **LinkedIn:** [linkedin.com/in/umit-arat](https://www.linkedin.com/in/umit-arat/)
* **Email:** [umitarat8098@gmail.com](mailto:umitarat8098@gmail.com)
* **GitHub:** [github.com/umitarat-dev](https://github.com/umitarat-dev) (Current Workspace)

dummy