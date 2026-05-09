from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.notification import NotificationTypeEnum


class NotificationResponse(BaseModel):
    id: int
    message: str
    type: NotificationTypeEnum
    is_read: bool
    ticket_id: Optional[int]
    sent_at: datetime

    model_config = {"from_attributes": True}


class NotificationConfig(BaseModel):
    type: NotificationTypeEnum
    message_template: str
    is_active: bool = True
