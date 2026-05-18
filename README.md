# AtomQuest – Goal Setting & Tracking Portal

AtomQuest is a web-based performance and goal tracking platform designed to simplify how employees, managers, and HR teams manage organizational goals and quarterly reviews.

The portal helps:

* employees create and track goals
* managers review approvals and progress
* admins monitor analytics, escalations, and completion rates

This project was built as part of the AtomQuest Hackathon 2026.

---

# Features

## Employee Module

* Create and manage quarterly goals
* Set targets, weightage, and UoM
* Submit goals for approval
* Track progress through quarterly check-ins
* View notifications and goal status

## Manager Module

* Review and approve team goals
* Edit targets and weightages
* Add check-in comments and feedback
* Monitor team progress and pending approvals

## Admin Module

* View organization-wide analytics
* Monitor escalations and completion rates
* Access audit logs
* Manage users and unlock goals

## Analytics Dashboard

* Goal completion metrics
* Quarterly progress trends
* Department-wise analytics
* Team performance insights
* Interactive charts and KPI cards

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* ShadCN UI
* Recharts

## Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication

## Database

* SQLite (local development)
* PostgreSQL compatible

---

# Project Structure

```bash
atomquest-portal/
│
├── frontend/
├── backend/
├── docs/
└── architecture/
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/Jyotsna024/atomquest-goal-tracking-portal.git
cd atomquest-goal-tracking-portal
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start backend server
uvicorn main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Demo Credentials

## Employee

```text
employee@atomquest.com
employee123
```

## Manager

```text
manager@atomquest.com
manager123
```

## Admin

```text
admin@atomquest.com
admin123
```

---

# Core Functionalities Implemented

* Goal creation and approval workflow
* Role-based authentication
* Quarterly check-ins
* Analytics dashboards
* Notifications system
* Audit logging
* Escalation tracking
* Goal validation rules
* Responsive enterprise UI

---

# Validation Rules

* Maximum 8 goals per employee
* Minimum weightage per goal = 10%
* Total weightage must equal 100%

---

# Deployment

## Frontend

Configured for deployment on Vercel.

## Backend

Configured for deployment on Render/Railway.

---

# Notes

This project was developed for the AtomQuest Hackathon 2026 with a focus on:

* usability
* workflow clarity
* responsive UI
* scalable architecture
* enterprise-style experience

