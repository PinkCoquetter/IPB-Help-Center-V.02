from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.notification import NotificationTypeEnum

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: NotificationTypeEnum
    is_read: bool
    ticket_id: Optional[int]
    created_at: datetime
    
    model_config = {"from_attributes": True}
