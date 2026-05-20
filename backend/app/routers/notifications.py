from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.dependencies.auth import get_current_user
from app.services.notification_service import get_user_notifications, mark_all_read, mark_read

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_notifications(current_user, db)

@router.patch("/read-all", status_code=200)
async def mark_all_as_read(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await mark_all_read(current_user, db)
    return {"message": "All notifications marked as read"}

@router.patch("/{notif_id}/read", status_code=200)
async def mark_one_as_read(notif_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await mark_read(notif_id, current_user, db)
    return {"message": "Notification marked as read"}
