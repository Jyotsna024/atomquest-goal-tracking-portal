# AtomQuest – Goal Setting & Tracking Portal

AtomQuest is a web-based enterprise performance and goal tracking platform designed to streamline goal management, quarterly reviews, and organizational performance monitoring.

The platform enables:
- Employees to create and track goals
- Managers to review progress and approvals
- Administrators to monitor analytics, escalations, and completion metrics

This project was developed for the **AtomQuest Hackathon 2026**.

---

# Live Deployment

## Frontend
https://atomquest-goal-tracking-portal-gamma.vercel.app

## Backend API
https://atomquest-goal-tracking-portal.onrender.com/health

---

# Features

## Employee Module
- Create and manage quarterly goals
- Set targets, weightage, and units of measurement
- Submit goals for approval
- Perform quarterly check-ins
- Track goal progress and notifications

## Manager Module
- Review and approve team goals
- Modify targets and weightages
- Add feedback and check-in comments
- Monitor pending approvals and team performance

## Admin Module
- View organization-wide analytics
- Monitor escalations and completion rates
- Access audit logs
- Manage users and unlock goals

## Analytics Dashboard
- Goal completion metrics
- Quarterly progress trends
- Department-wise analytics
- Team performance insights
- Interactive charts and KPI cards

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- Recharts

## Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

## Database
- SQLite (Development)
- PostgreSQL Compatible (Production)

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
venv\Scripts\activate

pip install -r requirements.txt

python init_db.py

uvicorn main:app --reload
```

Backend runs at:

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

Frontend runs at:

```bash
http://localhost:3000
```

---

# Demo Credentials

## Employee

```text
Email: employee@atomquest.com
Password: employee123
```

## Manager

```text
Email: manager@atomquest.com
Password: manager123
```

## Admin

```text
Email: admin@atomquest.com
Password: admin123
```

---

# Core Functionalities Implemented

- Goal creation and approval workflow
- Role-based authentication (RBAC)
- Quarterly check-ins
- Analytics dashboards
- Notifications system
- Audit logging
- Escalation tracking
- Goal validation rules
- Responsive enterprise UI

---

# Validation Rules

- Maximum 8 goals per employee
- Minimum weightage per goal: 10%
- Total goal weightage must equal 100%

---

# Deployment

## Frontend Deployment
Hosted on Vercel.

## Backend Deployment
Hosted on Render.

---

# Architecture Diagram

<img width="940" height="512" alt="image" src="https://github.com/user-attachments/assets/74184a20-0482-4dac-a951-e28f1032f7ca" />


---

# Notes

This project was developed with a focus on:
- Enterprise workflow clarity
- Scalable architecture
- Responsive UI/UX
- Performance tracking
- Secure authentication
- Clean and maintainable code structure
