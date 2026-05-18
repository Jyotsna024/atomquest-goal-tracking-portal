from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: str


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None


class AnalyticsSummary(BaseModel):
    total_employees: int
    total_goals: int
    completion_rate: float
    avg_progress: float
    goals_on_track: int
    goals_at_risk: int
    goals_behind: int
    goals_completed: int


class DepartmentStat(BaseModel):
    department: str
    employee_count: int
    goal_count: int
    completion_rate: float
    avg_progress: float


class QuarterlyTrend(BaseModel):
    quarter: str
    goals_set: int
    goals_completed: int
    completion_rate: float


class CategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float


class TeamMemberStat(BaseModel):
    user_id: str
    name: str
    department: str
    designation: str
    goals_count: int
    completion_rate: float
    avg_progress: float
    status: str
    last_checkin: Optional[str] = None
