import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from core.config import settings
from core.exceptions import AppException
from database.session import engine, Base
from routes import auth_routes, user_routes, goal_routes, checkin_routes, analytics_routes

# Initialize database models (for development, normally handled by Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for AtomQuest Portal",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
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
