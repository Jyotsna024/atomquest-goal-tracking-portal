from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import get_current_user, get_manager
from models.user import User
from schemas.auth import AnalyticsSummary, DepartmentStat, QuarterlyTrend, CategoryBreakdown, TeamMemberStat
from services.analytics_service import AnalyticsService
from typing import List

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return AnalyticsService.get_org_summary(db)


@router.get("/departments", response_model=List[DepartmentStat])
def get_departments(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return AnalyticsService.get_department_stats(db)


@router.get("/trends", response_model=List[QuarterlyTrend])
def get_trends(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return AnalyticsService.get_quarterly_trends(db)


@router.get("/categories", response_model=List[CategoryBreakdown])
def get_categories(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return AnalyticsService.get_category_breakdown(db)


@router.get("/team", response_model=List[TeamMemberStat])
def get_team_stats(db: Session = Depends(get_db), current_user: User = Depends(get_manager)):
    return AnalyticsService.get_team_stats(db, current_user.id)
