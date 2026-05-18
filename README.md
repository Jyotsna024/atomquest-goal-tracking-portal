# ⚛️ AtomQuest: Enterprise Goal Setting & Tracking Portal

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

AtomQuest is a premium, enterprise-grade performance management and goal-tracking portal designed for modern organizations. Built with a scalable Next.js frontend and a high-performance FastAPI backend, it provides a seamless workflow for employees to set goals, managers to review progress, and admins to oversee organizational analytics.

---

## ✨ Key Features

- **🎯 Goal Management:** Employees can draft, batch-submit, and track up to 8 quarterly goals (weighted up to 100%).
- **✅ Manager Approvals:** Intuitive dashboard for managers to review, approve, reject, or comment on pending team goals.
- **📈 Quarterly Check-ins:** Structured self-assessments and manager ratings with automated status recalculations (On Track, At Risk, Behind).
- **📊 Advanced Analytics:** Organization-wide dashboards featuring Recharts-powered interactive visualizations for completion rates, QoQ trends, and department comparisons.
- **🔐 Role-Based Access Control (RBAC):** Distinct experiences for `Employee`, `Manager`, and `Admin` users, secured via JWT authentication.
- **🎨 Premium UI/UX:** Responsive, accessible, and polished interface using Tailwind CSS, Radix UI, and Framer Motion for a true enterprise feel.

---

## 🏗️ Architecture

AtomQuest follows a decoupled, service-oriented architecture:

- **Frontend:** Next.js (App Router), React Hook Form + Zod (Validation), Tailwind CSS (Styling), Recharts (Analytics).
- **Backend:** FastAPI (Python), SQLAlchemy (ORM), Pydantic (Data Validation), Passlib/Bcrypt (Security).
- **Database:** SQLite (default for local development) / PostgreSQL (Production).

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/atomquest-portal.git
cd atomquest-portal
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed test data
python init_db.py

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will be available at `http://localhost:8000/api/v1`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start the Next.js development server
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

---

## 🔐 Test Credentials

Use the following seeded accounts to test different role experiences:

- **Employee:** `employee@atomquest.com` / `employee123`
- **Manager:** `manager@atomquest.com` / `manager123`
- **Admin:** `admin@atomquest.com` / `admin123`

---

## 📦 Deployment

AtomQuest is fully configured for cloud deployment.

### Frontend (Vercel)
The `vercel.json` file is pre-configured. Simply import the repository into Vercel and it will automatically detect the Next.js framework. Make sure to set the `API_BASE_URL` if not using the proxy rewrite.

### Backend (Render / Railway)
The `render.yaml` file is included for instant deployment on Render. Ensure you provision a PostgreSQL database and inject the `DATABASE_URL` and `JWT_SECRET` environment variables.

---

## 🤝 Hackathon Deliverables Checklist

- [x] Complete Next.js Frontend with responsive UI.
- [x] Complete FastAPI Backend with integrated SQLite/PostgreSQL.
- [x] End-to-End JWT Authentication and RBAC.
- [x] Real-time data fetching using Fetch API interceptors.
- [x] Seeded database for instant testing.
- [x] Deployment configurations ready.

---

*Built with ❤️ for the Hackathon.*
