<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Routing-React%20Router-CA4245?style=flat&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/HTTP-Axios-5A29E4?style=flat" />
  <img src="https://img.shields.io/badge/Auth-Token%20Storage-0EA5E9?style=flat" />
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=flat&logo=render&logoColor=black" />
</p>

<h1 align="center">Flight App Frontend ✈️</h1>

<p align="center">
Responsive React frontend for flight listing, reservation management, staff flight CRUD, and auth flows integrated with Django REST backend.
</p>

<div align="center">
  <h3>
    <a href="https://umitdev-flight-frontend.onrender.com">🖥️ Live (Prod)</a>
    |
    <a href="https://umitdev-flight-frontend-staging.onrender.com">🧪 Live (Staging)</a>
    |
    <a href="https://umitdev-flight-backend.onrender.com/swagger/">📘 Backend Swagger</a>
  </h3>
</div>

<!-- GIF PLACEHOLDER: put your gif inside frontend/ and update file name if needed -->
<div align="center">
  <img src="./frontend-demo.gif" alt="flight-frontend-demo" width="900"/>
</div>

## 📚 Navigation

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Local Setup](#-local-setup)
- [🔐 Environment Variables](#-environment-variables)
- [🌍 Environment Mapping](#-environment-mapping)
- [📌 Key Pages](#-key-pages)
- [📬 Contact](#-contact)

## ✨ Overview

This frontend provides:

- Public flight discovery (anonymous)
- Auth flows (register/login/logout)
- Reservation create/update/delete (multi-passenger)
- Profile page (password change)
- Staff panels for flight CRUD and reservation visibility

## 🚀 Features

- React Router based page navigation
- Axios API client with token interceptor
- LocalStorage token persistence (`flight_app_token`)
- Role-based UI guards (`user` vs `staff`)
- Home reservation modal (without leaving list page)
- Responsive navigation with auth dropdown
- Staging/prod backend routing support

## 🗂️ Project Structure

```text
src/
├─ api/
│  └─ client.js
├─ components/
│  └─ Navbar.jsx
├─ pages/
│  ├─ HomePage.jsx
│  ├─ FlightDetailPage.jsx
│  ├─ MyReservationsPage.jsx
│  ├─ StaffFlightsPage.jsx
│  ├─ ProfilePage.jsx
│  ├─ LoginPage.jsx
│  └─ RegisterPage.jsx
├─ App.jsx
├─ index.css
└─ main.jsx
```

## 🛠️ Tech Stack

- React + Vite
- React Router
- Axios
- Plain CSS (custom design system)
- Render (deployment)

## ⚡ Local Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## 🔐 Environment Variables

Use templates:

- `.env.example` (local)
- `.env.production.example` (production)

Main variable:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 🌍 Environment Mapping

- **Prod frontend** -> `https://umitdev-flight-backend.onrender.com`
- **Staging frontend** -> `https://umitdev-flight-backend-staging.onrender.com`
- **Local frontend** -> `http://127.0.0.1:8000`

## 📌 Key Pages

- `/` -> Flights home + reserve modal
- `/flights/:id` -> Flight details + reservation management
- `/my-reservations` -> User reservation list
- `/profile` -> User info + password change
- `/staff/flights` -> Staff flight CRUD
- `/staff/reservations` -> Staff reservation list
- `/login`, `/register`

## 📬 Contact

- GitHub: [@Umit8098](https://github.com/Umit8098)
- LinkedIn: [@umit-arat](https://linkedin.com/in/umit-arat/)
