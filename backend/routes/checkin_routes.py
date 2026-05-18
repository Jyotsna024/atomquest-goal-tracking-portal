from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import get_current_user, get_manager
from models.user import User
from schemas.checkin import CheckInCreate, CheckInReview, CheckInResponse, CheckInListResponse
from services.checkin_service import CheckInService

router = APIRouter(prefix="/checkins", tags=["Check-ins"])


@router.get("", response_model=CheckInListResponse)
def get_my_checkins(quarter: Optional[str] = None, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    checkins, total = CheckInService.get_for_user(db, current_user.id, quarter)
    return CheckInListResponse(checkins=checkins, total=total)


@router.post("", response_model=CheckInResponse, status_code=201)
def create_checkin(data: CheckInCreate, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    return CheckInService.create(db, current_user.id, data)


@router.post("/{checkin_id}/review", response_model=CheckInResponse)
def review_checkin(checkin_id: str, data: CheckInReview, db: Session = Depends(get_db),
                   current_user: User = Depends(get_manager)):
    return CheckInService.review(db, checkin_id, current_user.id, data)


@router.get("/team", response_model=CheckInListResponse)
def get_team_checkins(quarter: Optional[str] = None, db: Session = Depends(get_db),
                      current_user: User = Depends(get_manager)):
    checkins = CheckInService.get_team_checkins(db, current_user.id, quarter)
    return CheckInListResponse(checkins=checkins, total=len(checkins))
