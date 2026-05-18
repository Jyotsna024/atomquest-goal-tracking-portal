import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from database.session import Base
import enum


class UserRole(str, enum.Enum):
    employee = "employee"
    manager = "manager"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.employee)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    department = Column(String(100), nullable=False, default="Engineering")
    designation = Column(String(100), nullable=False, default="Software Engineer")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    goals = relationship("Goal", back_populates="user", foreign_keys="Goal.user_id")
    manager = relationship("User", remote_side="User.id", foreign_keys=[manager_id])
    reports = relationship("User", back_populates="manager", foreign_keys=[manager_id])
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    escalations = relationship("Escalation", back_populates="user", foreign_keys="Escalation.user_id")
