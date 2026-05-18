import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from core.config import settings
from core.exceptions import AppException
from database.session import engine, Base, SessionLocal
from routes import auth_routes, user_routes, goal_routes, checkin_routes, analytics_routes
from models.user import User, UserRole
from models.goal import Goal, GoalStatus
from auth.dependencies import hash_password
import logging

logger = logging.getLogger(__name__)

# Initialize database models
Base.metadata.create_all(bind=engine)


def seed_if_empty():
    """Seed demo users into the database if it is empty (safe for production cold starts)."""
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            logger.info("Database already has users — skipping seed.")
            return

        logger.info("Empty database detected — seeding demo users...")

        admin = User(
            name="Admin User", email="admin@atomquest.com",
            hashed_password=hash_password("admin123"),
            role=UserRole.admin, department="Operations", designation="System Admin",
        )
        db.add(admin)

        manager = User(
            name="Manager User", email="manager@atomquest.com",
            hashed_password=hash_password("manager123"),
            role=UserRole.manager, department="Engineering", designation="Engineering Manager",
        )
        db.add(manager)
        db.commit()
        db.refresh(manager)

        employee = User(
            name="Employee User", email="employee@atomquest.com",
            hashed_password=hash_password("employee123"),
            role=UserRole.employee, department="Engineering", designation="Software Engineer",
            manager_id=manager.id,
        )
        db.add(employee)
        db.commit()
        db.refresh(employee)

        goal = Goal(
            user_id=employee.id, title="Launch AtomQuest v1.0",
            description="Successfully launch the portal and get 500 active users.",
            thrust_area="Product", weightage=50, quarter="Q2 2026",
            status=GoalStatus.approved, approved=True,
        )
        db.add(goal)
        db.commit()

        logger.info("Seeding complete — 3 users + 1 goal created.")
    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()


# Auto-seed on module load (runs when uvicorn imports main)
seed_if_empty()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for AtomQuest Portal",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"loc": err["loc"], "msg": err["msg"], "type": err["type"]} for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": errors},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(user_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(goal_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(checkin_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_routes.router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
