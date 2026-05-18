from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session

from models.checkin import CheckIn, CheckInStatus
from models.goal import Goal
from models.notification import Notification, NotificationType
from models.user import User
from models.audit_log import AuditLog
from schemas.checkin import CheckInCreate, CheckInReview
from core.exceptions import NotFoundException, ForbiddenException, BadRequestException


class CheckInService:
    @staticmethod
    def get_by_id(db: Session, checkin_id: UUID) -> CheckIn:
        checkin = db.query(CheckIn).filter(CheckIn.id == checkin_id).first()
        if not checkin:
            raise NotFoundException("Check-in")
        return checkin

    @staticmethod
    def get_for_user(db: Session, user_id: UUID, quarter: Optional[str] = None) -> tuple[List[CheckIn], int]:
        goal_ids = [g.id for g in db.query(Goal).filter(Goal.user_id == user_id).all()]
        if not goal_ids:
            return [], 0
        query = db.query(CheckIn).filter(CheckIn.goal_id.in_(goal_ids))
        if quarter:
            query = query.filter(CheckIn.quarter == quarter)
        checkins = query.order_by(CheckIn.created_at.desc()).all()
        return checkins, len(checkins)

    @staticmethod
    def create(db: Session, user_id: UUID, data: CheckInCreate) -> CheckIn:
        goal = db.query(Goal).filter(Goal.id == data.goal_id).first()
        if not goal:
            raise NotFoundException("Goal")
        if goal.user_id != user_id:
            raise ForbiddenException("You can only create check-ins for your own goals")

        checkin = CheckIn(
            goal_id=data.goal_id,
            quarter=data.quarter,
            achievement=data.achievement,
            self_rating=data.self_rating,
            employee_comment=data.employee_comment,
            status=CheckInStatus.submitted,
        )
        db.add(checkin)

        # Update goal achievement
        goal.achievement = data.achievement
        if goal.target > 0:
            pct = (data.achievement / goal.target) * 100
            if pct >= 100:
                goal.status = "completed"
            elif pct >= 60:
                goal.status = "on-track"
            elif pct >= 30:
                goal.status = "at-risk"
            else:
                goal.status = "behind"

        db.commit()
        db.refresh(checkin)

        # Notify manager
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.manager_id:
            notification = Notification(
                user_id=user.manager_id,
                title="Check-in Submitted",
                message=f"{user.name} submitted a check-in for '{goal.title}'",
                type=NotificationType.info,
                link="/manager/team",
            )
            db.add(notification)
            db.commit()

        return checkin

    @staticmethod
    def review(db: Session, checkin_id: UUID, manager_id: UUID, data: CheckInReview) -> CheckIn:
        checkin = CheckInService.get_by_id(db, checkin_id)
        goal = db.query(Goal).filter(Goal.id == checkin.goal_id).first()
        if not goal:
            raise NotFoundException("Goal")

        employee = db.query(User).filter(User.id == goal.user_id).first()
        if not employee or employee.manager_id != manager_id:
            raise ForbiddenException("You can only review check-ins for your team members")

        checkin.manager_comment = data.manager_comment
        checkin.manager_rating = data.manager_rating
        checkin.status = CheckInStatus.reviewed
        db.commit()
        db.refresh(checkin)

        # Notify employee
        notification = Notification(
            user_id=goal.user_id,
            title="Check-in Reviewed",
            message=f"Your manager reviewed your check-in for '{goal.title}'",
            type=NotificationType.success,
            link="/employee/check-in",
        )
        db.add(notification)
        db.commit()

        return checkin

    @staticmethod
    def get_team_checkins(db: Session, manager_id: UUID, quarter: Optional[str] = None) -> List[CheckIn]:
        team_ids = [u.id for u in db.query(User).filter(User.manager_id == manager_id).all()]
        if not team_ids:
            return []
        goal_ids = [g.id for g in db.query(Goal).filter(Goal.user_id.in_(team_ids)).all()]
        if not goal_ids:
            return []
        query = db.query(CheckIn).filter(CheckIn.goal_id.in_(goal_ids))
        if quarter:
            query = query.filter(CheckIn.quarter == quarter)
        return query.order_by(CheckIn.created_at.desc()).all()
