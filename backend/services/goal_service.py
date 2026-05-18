import json
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from models.goal import Goal, GoalStatus
from models.user import User
from models.audit_log import AuditLog
from models.notification import Notification, NotificationType
from schemas.goal import GoalCreate, GoalUpdate, GoalApproval, GoalBatchCreate
from core.config import settings
from core.exceptions import (
    NotFoundException, BadRequestException, ForbiddenException, ValidationException,
)


class GoalService:
    @staticmethod
    def get_by_id(db: Session, goal_id: UUID) -> Goal:
        goal = db.query(Goal).filter(Goal.id == goal_id).first()
        if not goal:
            raise NotFoundException("Goal")
        return goal

    @staticmethod
    def get_user_goals(db: Session, user_id: UUID, quarter: Optional[str] = None,
                       status: Optional[str] = None, skip: int = 0, limit: int = 50) -> tuple[List[Goal], int, int]:
        query = db.query(Goal).filter(Goal.user_id == user_id)
        if quarter:
            query = query.filter(Goal.quarter == quarter)
        if status:
            query = query.filter(Goal.status == status)
        total = query.count()
        goals = query.order_by(Goal.created_at.desc()).offset(skip).limit(limit).all()
        total_weightage = sum(g.weightage for g in goals) if not quarter else \
            db.query(func.sum(Goal.weightage)).filter(Goal.user_id == user_id, Goal.quarter == quarter).scalar() or 0
        return goals, total, total_weightage

    @staticmethod
    def get_pending_approvals(db: Session, manager_id: UUID) -> List[Goal]:
        team_ids = [u.id for u in db.query(User).filter(User.manager_id == manager_id).all()]
        if not team_ids:
            return []
        return db.query(Goal).filter(
            Goal.user_id.in_(team_ids),
            Goal.status == GoalStatus.pending,
        ).order_by(Goal.created_at.desc()).all()

    @staticmethod
    def _validate_weightage(db: Session, user_id: UUID, quarter: str, new_weightage: int, exclude_goal_id: Optional[UUID] = None):
        query = db.query(func.sum(Goal.weightage)).filter(
            Goal.user_id == user_id, Goal.quarter == quarter
        )
        if exclude_goal_id:
            query = query.filter(Goal.id != exclude_goal_id)
        existing_weightage = query.scalar() or 0

        if new_weightage < settings.MIN_WEIGHTAGE:
            raise ValidationException(f"Individual goal weightage must be at least {settings.MIN_WEIGHTAGE}%")

        goal_count = db.query(Goal).filter(Goal.user_id == user_id, Goal.quarter == quarter).count()
        if exclude_goal_id:
            goal_count -= 1
        if goal_count >= settings.MAX_GOALS_PER_EMPLOYEE:
            raise ValidationException(f"Maximum {settings.MAX_GOALS_PER_EMPLOYEE} goals allowed per quarter")

    @staticmethod
    def create(db: Session, user_id: UUID, data: GoalCreate) -> Goal:
        GoalService._validate_weightage(db, user_id, data.quarter, data.weightage)

        goal = Goal(
            user_id=user_id,
            title=data.title,
            description=data.description,
            thrust_area=data.thrust_area,
            uom=data.uom,
            target=data.target,
            weightage=data.weightage,
            quarter=data.quarter,
            due_date=data.due_date,
            status=GoalStatus.pending,
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)

        # Audit log
        GoalService._audit(db, user_id, "Goal Created", "goal", str(goal.id), None, goal.title)
        return goal

    @staticmethod
    def batch_create(db: Session, user_id: UUID, data: GoalBatchCreate) -> List[Goal]:
        # Validate total weightage
        total = sum(g.weightage for g in data.goals)
        if total != settings.TOTAL_WEIGHTAGE:
            raise ValidationException(f"Total weightage must equal {settings.TOTAL_WEIGHTAGE}%, got {total}%")

        if len(data.goals) > settings.MAX_GOALS_PER_EMPLOYEE:
            raise ValidationException(f"Maximum {settings.MAX_GOALS_PER_EMPLOYEE} goals allowed")

        for g in data.goals:
            if g.weightage < settings.MIN_WEIGHTAGE:
                raise ValidationException(f"Each goal must have at least {settings.MIN_WEIGHTAGE}% weightage")

        goals = []
        for g in data.goals:
            goal = Goal(
                user_id=user_id,
                title=g.title,
                description=g.description,
                thrust_area=g.thrust_area,
                uom=g.uom,
                target=g.target,
                weightage=g.weightage,
                quarter=g.quarter,
                due_date=g.due_date,
                status=GoalStatus.pending,
            )
            db.add(goal)
            goals.append(goal)

        db.commit()
        for goal in goals:
            db.refresh(goal)
            GoalService._audit(db, user_id, "Goal Created", "goal", str(goal.id), None, goal.title)

        # Notify manager
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.manager_id:
            notification = Notification(
                user_id=user.manager_id,
                title="New Goals Submitted",
                message=f"{user.name} has submitted {len(goals)} goal(s) for approval",
                type=NotificationType.info,
                link="/manager/approvals",
            )
            db.add(notification)
            db.commit()

        return goals

    @staticmethod
    def update(db: Session, goal_id: UUID, user_id: UUID, data: GoalUpdate) -> Goal:
        goal = GoalService.get_by_id(db, goal_id)
        if goal.user_id != user_id:
            raise ForbiddenException("You can only edit your own goals")
        if goal.locked:
            raise BadRequestException("This goal is locked and cannot be edited")

        old_values = {"title": goal.title, "weightage": goal.weightage, "status": str(goal.status)}
        update_data = data.model_dump(exclude_unset=True)

        if "weightage" in update_data:
            GoalService._validate_weightage(db, user_id, goal.quarter, update_data["weightage"], goal.id)
        if "status" in update_data:
            update_data["status"] = GoalStatus(update_data["status"])

        for key, value in update_data.items():
            setattr(goal, key, value)

        db.commit()
        db.refresh(goal)
        GoalService._audit(db, user_id, "Goal Updated", "goal", str(goal.id),
                           json.dumps(old_values), json.dumps(update_data))
        return goal

    @staticmethod
    def approve(db: Session, goal_id: UUID, manager_id: UUID, data: GoalApproval) -> Goal:
        goal = GoalService.get_by_id(db, goal_id)

        # Verify manager owns this employee
        employee = db.query(User).filter(User.id == goal.user_id).first()
        if not employee or employee.manager_id != manager_id:
            raise ForbiddenException("You can only approve goals for your team members")

        if data.approved:
            goal.status = GoalStatus.approved
            goal.approved = True
            goal.locked = True
            if data.title:
                goal.title = data.title
            if data.weightage:
                goal.weightage = data.weightage
        else:
            goal.status = GoalStatus.rejected
            goal.approved = False

        goal.manager_comment = data.manager_comment
        db.commit()
        db.refresh(goal)

        # Notify employee
        notification = Notification(
            user_id=goal.user_id,
            title=f"Goal {'Approved' if data.approved else 'Rejected'}",
            message=f'Your goal "{goal.title}" has been {"approved" if data.approved else "rejected"} by your manager',
            type=NotificationType.success if data.approved else NotificationType.warning,
            link="/employee/goals",
        )
        db.add(notification)

        GoalService._audit(db, manager_id, f"Goal {'Approved' if data.approved else 'Rejected'}",
                           "goal", str(goal.id), None, data.manager_comment)
        db.commit()
        return goal

    @staticmethod
    def unlock(db: Session, goal_id: UUID, admin_id: UUID, reason: str) -> Goal:
        goal = GoalService.get_by_id(db, goal_id)
        goal.locked = False
        db.commit()
        db.refresh(goal)

        # Notify owner
        notification = Notification(
            user_id=goal.user_id,
            title="Goal Unlocked",
            message=f'Your goal "{goal.title}" has been unlocked for editing',
            type=NotificationType.info,
            link="/employee/goals",
        )
        db.add(notification)
        GoalService._audit(db, admin_id, "Goal Unlocked", "goal", str(goal.id), None, reason)
        db.commit()
        return goal

    @staticmethod
    def delete(db: Session, goal_id: UUID, user_id: UUID) -> None:
        goal = GoalService.get_by_id(db, goal_id)
        if goal.user_id != user_id:
            raise ForbiddenException("You can only delete your own goals")
        if goal.locked:
            raise BadRequestException("Cannot delete a locked goal")
        GoalService._audit(db, user_id, "Goal Deleted", "goal", str(goal_id), goal.title, None)
        db.delete(goal)
        db.commit()

    @staticmethod
    def _audit(db: Session, user_id: UUID, action: str, entity: str,
               entity_id: str, old_value: Optional[str], new_value: Optional[str]):
        log = AuditLog(
            user_id=user_id, action=action, entity=entity,
            entity_id=entity_id, old_value=old_value, new_value=new_value,
        )
        db.add(log)
