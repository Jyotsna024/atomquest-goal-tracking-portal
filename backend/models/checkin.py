import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from database.session import Base
import enum


class CheckInStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    reviewed = "reviewed"


class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id"), nullable=False, index=True)
    quarter = Column(String(10), nullable=False)
    achievement = Column(Integer, nullable=False, default=0)
    self_rating = Column(Integer, nullable=True)  # 1-5
    status = Column(SAEnum(CheckInStatus), nullable=False, default=CheckInStatus.draft)
    employee_comment = Column(Text, nullable=True)
    manager_comment = Column(Text, nullable=True)
    manager_rating = Column(Integer, nullable=True)  # 1-5
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    goal = relationship("Goal", back_populates="checkins")
