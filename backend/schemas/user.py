from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "employee"
    department: str = "Engineering"
    designation: str = "Software Engineer"
    manager_id: Optional[UUID] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    role: Optional[str] = None
    manager_id: Optional[UUID] = None


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    department: str
    designation: str
    manager_id: Optional[UUID] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
