import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, ForeignKey, Text, Enum as SAEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from database.session import Base
import enum


class GoalStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    on_track = "on-track"
    at_risk = "at-risk"
    behind = "behind"
    completed = "completed"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    thrust_area = Column(String(200), nullable=False)  # category
    uom = Column(String(100), nullable=True, default="Percentage")  # unit of measure
    target = Column(Integer, nullable=False, default=100)
    achievement = Column(Integer, nullable=False, default=0)
    weightage = Column(Integer, nullable=False)
    status = Column(SAEnum(GoalStatus), nullable=False, default=GoalStatus.draft)
    approved = Column(Boolean, default=False)
    locked = Column(Boolean, default=False)
    quarter = Column(String(10), nullable=False)  # e.g., "Q2 2026"
    due_date = Column(Date, nullable=True)
    manager_comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="goals")
    checkins = relationship("CheckIn", back_populates="goal", cascade="all, delete-orphan")

    @property
    def progress(self) -> int:
        if self.target == 0:
            return 0
        return min(round((self.achievement / self.target) * 100), 100)
