from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=500)
    description: str = Field(..., min_length=10)
    thrust_area: str = Field(..., min_length=1)
    uom: str = "Percentage"
    target: int = Field(default=100, ge=1)
    weightage: int = Field(..., ge=10, le=100)
    quarter: str = Field(..., min_length=1)
    due_date: Optional[date] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thrust_area: Optional[str] = None
    uom: Optional[str] = None
    target: Optional[int] = None
    achievement: Optional[int] = None
    weightage: Optional[int] = None
    status: Optional[str] = None
    due_date: Optional[date] = None


class GoalApproval(BaseModel):
    approved: bool
    manager_comment: Optional[str] = None
    # Manager can adjust these when approving
    title: Optional[str] = None
    weightage: Optional[int] = None


class GoalUnlock(BaseModel):
    reason: str = Field(..., min_length=5)


class GoalBatchCreate(BaseModel):
    goals: List[GoalCreate] = Field(..., min_length=1, max_length=8)


class GoalResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str
    thrust_area: str
    uom: str
    target: int
    achievement: int
    weightage: int
    status: str
    approved: bool
    locked: bool
    quarter: str
    due_date: Optional[date] = None
    manager_comment: Optional[str] = None
    progress: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class GoalListResponse(BaseModel):
    goals: List[GoalResponse]
    total: int
    total_weightage: int
