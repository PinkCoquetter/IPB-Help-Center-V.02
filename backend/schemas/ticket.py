from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.ticket import TicketStatusEnum, PriorityEnum
from schemas.user import UserResponse


class TicketCreate(BaseModel):
    subject: str
    description: str
    category_id: Optional[int] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM


class TicketStatusUpdate(BaseModel):
    status: TicketStatusEnum
    note: Optional[str] = None


class TicketAssign(BaseModel):
    staff_id: int


class DocumentResponse(BaseModel):
    id: int
    original_name: str
    file_type: str
    file_size: int
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class TicketResponseSchema(BaseModel):
    id: int
    message: str
    user: UserResponse
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketHistoryResponse(BaseModel):
    id: int
    old_status: Optional[TicketStatusEnum]
    new_status: TicketStatusEnum
    note: Optional[str]
    changed_at: datetime

    model_config = {"from_attributes": True}


class TicketListResponse(BaseModel):
    id: int
    ticket_number: str
    subject: str
    status: TicketStatusEnum
    priority: PriorityEnum
    category_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class TicketDetailResponse(BaseModel):
    id: int
    ticket_number: str
    queue_number: Optional[int]
    subject: str
    description: str
    status: TicketStatusEnum
    priority: PriorityEnum
    user: UserResponse
    assigned_staff: Optional[UserResponse]
    category_id: Optional[int]
    documents: List[DocumentResponse]
    responses: List[TicketResponseSchema]
    history: List[TicketHistoryResponse]
    created_at: datetime
    updated_at: Optional[datetime]
    resolved_at: Optional[datetime]

    model_config = {"from_attributes": True}


class ReplyCreate(BaseModel):
    message: str


class TicketReportResponse(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    rejected_tickets: int
    closed_tickets: int
    avg_resolution_hours: Optional[float]
