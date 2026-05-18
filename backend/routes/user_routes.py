from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import get_current_user, get_admin
from models.user import User
from schemas.user import UserResponse, UserUpdate, UserListResponse
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("", response_model=UserListResponse)
def list_users(role: Optional[str] = None, department: Optional[str] = None,
               skip: int = 0, limit: int = 100,
               db: Session = Depends(get_db), _: User = Depends(get_admin)):
    users, total = UserService.get_all(db, role=role, department=department, skip=skip, limit=limit)
    return UserListResponse(users=users, total=total)


from uuid import UUID

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return UserService.get_by_id(db, user_id)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, data: UserUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin)):
    return UserService.update(db, user_id, data)
