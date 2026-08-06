# MediCheck

MediCheck is a web-based platform designed to help users locate medicines available at pharmacies across Kathmandu. Developed as a Semester IV academic project at Malpi International College, the system aims to improve access to essential medicines by providing real-time pharmacy inventory information.

## Overview

Finding a required medicine can often be time-consuming, especially when patients need to visit multiple pharmacies before locating it. MediCheck addresses this problem by allowing users to search for medicines and instantly view pharmacies where the medicine is currently available.

The platform also enables pharmacies to maintain and update their inventory, ensuring that stock information remains accurate and up to date.

## Key Features

### User Portal

- Search for medicines by name, generic name, or composition
- View medicine availability across registered pharmacies
- Locate nearby pharmacies with the required medicine in stock
- Access pharmacy details and location information

### Pharmacy Portal

- Manage and update medicine inventory (add, edit, and delete batches)
- Record sales through a built-in point-of-sale (POS) that decrements stock automatically
- Add new medicines to the global catalogue
- Monitor low-stock and expiring medicines
- Manage patients and outstanding credit
- Mark staff attendance
- Request owner / license / PAN updates, subject to admin approval

### Admin Portal

- Review and approve pharmacy registrations
- Approve, suspend, or ban pharmacy accounts
- Manage the global medicine catalogue (add, edit, approve, reject, delete)
- Review and approve pharmacy profile change requests
- Manage customers and monitor platform statistics

## Technology Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React 19, Vite 8, CSS Modules                |
| Backend     | Python, Django 6, Django REST Framework      |
| Database    | SQLite (development)                         |
| Auth        | JWT (SimpleJWT)                              |

## Installation Guide

### Prerequisites

- Python 3.13+
- Node.js 20+

### Backend Setup

```bash
git clone https://github.com/satyam-th/MediCheck.git
cd MediCheck/backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the Django backend.

### Seed Data (Optional)

```bash
cd backend
python manage.py shell < seed.py
```

On Windows PowerShell, use:

```powershell
cd backend
Get-Content seed.py | python manage.py shell
```

The seed script populates the database with medicines, inventory, sales, and the following demo accounts:

| Role          | Email                   | Password    |
|---------------|-------------------------|-------------|
| Admin         | admin@medicheck.com     | admin123    |
| Pharmacy      | pharmacy@citymeds.com   | pharm1234   |
| Customer      | ram@example.com         | customer123 |
## Project Objective

The primary objective of MediCheck is to reduce the time and effort required to find essential medicines. By connecting users with pharmacies through a centralized platform, the system promotes convenience, accessibility, and efficient healthcare service delivery.

## Development Team

- Samiksha Shrestha
- Satyam Thapa
- Ugesh KC

**Malpi International College — Semester IV Project**
