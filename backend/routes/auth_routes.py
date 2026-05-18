from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import verify_password, create_access_token, hash_password
from schemas.auth import LoginRequest, TokenResponse
from schemas.user import UserCreate, UserResponse
from services.user_service import UserService
from core.exceptions import UnauthorizedException

router = APIRouter(prefix="/auth", tags=["Authentication"])


import logging

logger = logging.getLogger(__name__)

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    logger.info(f"Login request received for email: {data.email}")
    user = UserService.get_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        logger.warning(f"Failed login attempt for email: {data.email}")
        raise UnauthorizedException("Invalid email or password")
    
    logger.info(f"Successful login for user: {user.id}")
    token = create_access_token(str(user.id), user.role.value)
    return TokenResponse(access_token=token, user_id=str(user.id), role=user.role.value, name=user.name)


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = UserService.create(db, data)
    return user
