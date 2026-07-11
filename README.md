# MediCheck

MediCheck is a web-based platform designed to help users locate medicines available at pharmacies across Kathmandu. Developed as a Semester IV academic project at Malpi International College, the system aims to improve access to essential medicines by providing real-time pharmacy inventory information.

## Overview

Finding a required medicine can often be time-consuming, especially when patients need to visit multiple pharmacies before locating it. MediCheck addresses this problem by allowing users to search for medicines and instantly view pharmacies where the medicine is currently available.

The platform also enables pharmacies to maintain and update their inventory, ensuring that stock information remains accurate and up to date.

## Key Features

### User Portal

- Search for medicines by name
- View medicine availability across registered pharmacies
- Locate nearby pharmacies with the required medicine in stock
- Access pharmacy details and location information

### Pharmacy Portal

- Manage and update medicine inventory
- Add new medicines to stock records
- Modify availability and stock status in real time
- Monitor listed products efficiently

### Admin Portal

- Review and approve pharmacy registrations
- Manage users and pharmacy accounts
- Monitor platform activity and maintain database integrity
- Oversee system-wide operations

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

## API Endpoints

### Auth (`/api/auth/`)
| Method | Path              | Description               |
|--------|-------------------|---------------------------|
| POST   | `/login/`         | Login, returns JWT tokens |
| POST   | `/register/`      | Register as customer      |
| POST   | `/register/pharmacy/` | Register as pharmacy (pending approval) |
| GET    | `/me/`            | Get current user profile  |
| POST   | `/token/refresh/` | Refresh JWT access token  |

### Public (`/api/`)
| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/search/?q=`          | Search approved medicines           |
| GET    | `/availability/`        | Check medicine stock by pharmacy    |
| GET    | `/pharmacies/nearby/`   | List active pharmacies with GPS     |

### Pharmacy Dashboard (`/api/pharmacy/`)
| Method | Path                     | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/profile/`              | Get pharmacy profile     |
| GET    | `/inventory/`            | List inventory           |
| POST   | `/inventory/`            | Add inventory item       |
| GET    | `/inventory/low_stock/`  | Low stock items          |
| GET    | `/sales/`                | List sales               |
| POST   | `/sales/`                | Create sale              |
| GET    | `/sales/daily_summary/`  | Today's sales summary    |
| POST   | `/attendance/`           | Mark staff attendance    |

## Project Objective

The primary objective of MediCheck is to reduce the time and effort required to find essential medicines. By connecting users with pharmacies through a centralized platform, the system promotes convenience, accessibility, and efficient healthcare service delivery.

## Development Team

- Satyam Thapa
- Samiksha Shrestha
- Ugesh KC

**Malpi International College — Semester IV Project**
