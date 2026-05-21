from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.ticket import TicketStatusEnum, PriorityEnum
from app.schemas.user import UserResponse
from app.schemas.category import CategoryResponse

class TicketCreate(BaseModel):
    title: str
    description: str
    category_id: Optional[int] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM

class TicketStatusUpdate(BaseModel):
    status: TicketStatusEnum
    note: Optional[str] = None

class TicketAssign(BaseModel):
    staff_id: int

class TicketReplyCreate(BaseModel):
    message: str

class TicketAttachmentResponse(BaseModel):
    id: int
    file_name: str
    file_size: int
    uploaded_at: datetime
    
    model_config = {"from_attributes": True}

class TicketReplyResponse(BaseModel):
    id: int
    message: str
    sender: UserResponse
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
    title: str
    status: TicketStatusEnum
    priority: PriorityEnum
    category_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = {"from_attributes": True}

class TicketDetailResponse(BaseModel):
    id: int
    ticket_number: str
    title: str
    description: str
    status: TicketStatusEnum
    priority: PriorityEnum
    student: UserResponse
    assigned_staff: Optional[UserResponse]
    category: Optional[CategoryResponse]
    attachments: List[TicketAttachmentResponse]
    replies: List[TicketReplyResponse]
    history: List[TicketHistoryResponse]
    created_at: datetime
    updated_at: Optional[datetime]
    resolved_at: Optional[datetime]
    
    model_config = {"from_attributes": True}

class TicketReportResponse(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    rejected_tickets: int
    closed_tickets: int
    avg_resolution_hours: Optional[float] = None

    model_config = {"from_attributes": True}