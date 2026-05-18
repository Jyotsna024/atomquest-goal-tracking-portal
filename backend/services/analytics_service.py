from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.goal import Goal, GoalStatus
from models.user import User
from models.checkin import CheckIn
from schemas.auth import AnalyticsSummary, DepartmentStat, QuarterlyTrend, CategoryBreakdown, TeamMemberStat


class AnalyticsService:
    @staticmethod
    def get_org_summary(db: Session) -> AnalyticsSummary:
        total_emp = db.query(User).count()
        total_goals = db.query(Goal).count()
        completed = db.query(Goal).filter(Goal.status == GoalStatus.completed).count()
        on_track = db.query(Goal).filter(Goal.status == GoalStatus.on_track).count()
        at_risk = db.query(Goal).filter(Goal.status == GoalStatus.at_risk).count()
        behind = db.query(Goal).filter(Goal.status == GoalStatus.behind).count()
        rate = round(completed / total_goals * 100, 1) if total_goals else 0
        goals_list = db.query(Goal).all()
        avg_p = round(sum(g.progress for g in goals_list) / len(goals_list), 1) if goals_list else 0
        return AnalyticsSummary(total_employees=total_emp, total_goals=total_goals,
            completion_rate=rate, avg_progress=avg_p, goals_on_track=on_track,
            goals_at_risk=at_risk, goals_behind=behind, goals_completed=completed)

    @staticmethod
    def get_department_stats(db: Session) -> List[DepartmentStat]:
        depts = db.query(User.department).distinct().all()
        result = []
        for (d,) in depts:
            uids = [u.id for u in db.query(User).filter(User.department == d).all()]
            goals = db.query(Goal).filter(Goal.user_id.in_(uids)).all() if uids else []
            gc = len(goals)
            done = sum(1 for g in goals if g.status == GoalStatus.completed)
            result.append(DepartmentStat(department=d, employee_count=len(uids), goal_count=gc,
                completion_rate=round(done/gc*100,1) if gc else 0,
                avg_progress=round(sum(g.progress for g in goals)/gc,1) if gc else 0))
        return result

    @staticmethod
    def get_quarterly_trends(db: Session) -> List[QuarterlyTrend]:
        quarters = db.query(Goal.quarter).distinct().order_by(Goal.quarter).all()
        return [QuarterlyTrend(quarter=q, goals_set=db.query(Goal).filter(Goal.quarter==q).count(),
            goals_completed=db.query(Goal).filter(Goal.quarter==q,Goal.status==GoalStatus.completed).count(),
            completion_rate=round(db.query(Goal).filter(Goal.quarter==q,Goal.status==GoalStatus.completed).count()/max(db.query(Goal).filter(Goal.quarter==q).count(),1)*100,1))
            for (q,) in quarters]

    @staticmethod
    def get_category_breakdown(db: Session) -> List[CategoryBreakdown]:
        total = max(db.query(Goal).count(), 1)
        cats = db.query(Goal.thrust_area, func.count(Goal.id)).group_by(Goal.thrust_area).all()
        return [CategoryBreakdown(category=c, count=n, percentage=round(n/total*100,1)) for c,n in cats]

    @staticmethod
    def get_team_stats(db: Session, manager_id: UUID) -> List[TeamMemberStat]:
        team = db.query(User).filter(User.manager_id == manager_id).all()
        result = []
        for m in team:
            goals = db.query(Goal).filter(Goal.user_id == m.id).all()
            gc = len(goals)
            done = sum(1 for g in goals if g.status == GoalStatus.completed)
            avg_p = round(sum(g.progress for g in goals)/gc,1) if gc else 0
            ar = any(g.status == GoalStatus.at_risk for g in goals)
            st = "at-risk" if ar else ("on-track" if avg_p >= 50 else "behind")
            lc = db.query(CheckIn).join(Goal).filter(Goal.user_id==m.id).order_by(CheckIn.created_at.desc()).first()
            result.append(TeamMemberStat(user_id=str(m.id), name=m.name, department=m.department,
                designation=m.designation, goals_count=gc, completion_rate=round(done/max(gc,1)*100,1),
                avg_progress=avg_p, status=st, last_checkin=lc.created_at.isoformat() if lc else None))
        return result
