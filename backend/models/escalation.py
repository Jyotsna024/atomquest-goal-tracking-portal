import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from database.session import Base
import enum


class EscalationSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class EscalationStatus(str, enum.Enum):
    open = "open"
    in_progress = "in-progress"
    resolved = "resolved"
    closed = "closed"


class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(SAEnum(EscalationSeverity), nullable=False, default=EscalationSeverity.medium)
    status = Column(SAEnum(EscalationStatus), nullable=False, default=EscalationStatus.open)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="escalations", foreign_keys=[user_id])
    assignee = relationship("User", foreign_keys=[assigned_to])
