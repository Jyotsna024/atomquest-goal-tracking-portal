from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    type: str
    read: bool
    link: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int
    unread_count: int


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    action: str
    entity: str
    entity_id: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditLogListResponse(BaseModel):
    logs: List[AuditLogResponse]
    total: int


class EscalationCreate(BaseModel):
    type: str
    description: str
    severity: str = "medium"
    assigned_to: Optional[UUID] = None


class EscalationUpdate(BaseModel):
    status: Optional[str] = None
    resolution_notes: Optional[str] = None
    assigned_to: Optional[UUID] = None


class EscalationResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    description: str
    severity: str
    status: str
    assigned_to: Optional[UUID] = None
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class EscalationListResponse(BaseModel):
    escalations: List[EscalationResponse]
    total: int
