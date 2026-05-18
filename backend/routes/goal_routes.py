from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import get_current_user, get_manager, get_admin
from models.user import User
from schemas.goal import (GoalCreate, GoalUpdate, GoalApproval, GoalUnlock,
                          GoalBatchCreate, GoalResponse, GoalListResponse)
from services.goal_service import GoalService

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=GoalListResponse)
def get_my_goals(quarter: Optional[str] = None, status: Optional[str] = None,
                 skip: int = 0, limit: int = 50,
                 db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals, total, tw = GoalService.get_user_goals(db, current_user.id, quarter, status, skip, limit)
    return GoalListResponse(goals=[GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key)
        for c in g.__table__.columns}) for g in goals], total=total, total_weightage=tw)


@router.post("", response_model=GoalResponse, status_code=201)
def create_goal(data: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = GoalService.create(db, current_user.id, data)
    return GoalResponse(progress=goal.progress, **{c.key: getattr(goal, c.key) for c in goal.__table__.columns})


@router.post("/batch", response_model=GoalListResponse, status_code=201)
def batch_create_goals(data: GoalBatchCreate, db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    goals = GoalService.batch_create(db, current_user.id, data)
    return GoalListResponse(
        goals=[GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns}) for g in goals],
        total=len(goals), total_weightage=sum(g.weightage for g in goals))


@router.get("/pending", response_model=GoalListResponse)
def get_pending_approvals(db: Session = Depends(get_db), current_user: User = Depends(get_manager)):
    goals = GoalService.get_pending_approvals(db, current_user.id)
    return GoalListResponse(
        goals=[GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns}) for g in goals],
        total=len(goals), total_weightage=sum(g.weightage for g in goals))


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: str, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    g = GoalService.get_by_id(db, goal_id)
    return GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns})


@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, data: GoalUpdate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    g = GoalService.update(db, goal_id, current_user.id, data)
    return GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns})


@router.post("/{goal_id}/approve", response_model=GoalResponse)
def approve_goal(goal_id: str, data: GoalApproval, db: Session = Depends(get_db),
                 current_user: User = Depends(get_manager)):
    g = GoalService.approve(db, goal_id, current_user.id, data)
    return GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns})


@router.post("/{goal_id}/unlock", response_model=GoalResponse)
def unlock_goal(goal_id: str, data: GoalUnlock, db: Session = Depends(get_db),
                _: User = Depends(get_admin)):
    g = GoalService.unlock(db, goal_id, _.id, data.reason)
    return GoalResponse(progress=g.progress, **{c.key: getattr(g, c.key) for c in g.__table__.columns})


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    GoalService.delete(db, goal_id, current_user.id)
