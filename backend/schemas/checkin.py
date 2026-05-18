from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class CheckInCreate(BaseModel):
    goal_id: UUID
    quarter: str
    achievement: int = Field(default=0, ge=0)
    self_rating: Optional[int] = Field(default=None, ge=1, le=5)
    employee_comment: Optional[str] = None


class CheckInReview(BaseModel):
    manager_comment: Optional[str] = None
    manager_rating: Optional[int] = Field(default=None, ge=1, le=5)


class CheckInResponse(BaseModel):
    id: UUID
    goal_id: UUID
    quarter: str
    achievement: int
    self_rating: Optional[int] = None
    status: str
    employee_comment: Optional[str] = None
    manager_comment: Optional[str] = None
    manager_rating: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckInListResponse(BaseModel):
    checkins: List[CheckInResponse]
    total: int
