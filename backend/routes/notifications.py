from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from database import get_db
from models import Notification, User
from schemas.notification import NotificationResponse
from utils.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifikasi"])


@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Daftar notifikasi milik user yang login.
    Use Case: Menerima Notifikasi Status Tiket
    """
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.sent_at.desc())
        .limit(50)
    )
    return result.scalars().all()


@router.patch("/read-all", status_code=200)
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tandai semua notifikasi sebagai sudah dibaca."""
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    return {"message": "Semua notifikasi telah ditandai dibaca"}


@router.patch("/{notif_id}/read", status_code=200)
async def mark_read(
    notif_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tandai satu notifikasi sebagai dibaca."""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notif_id,
            Notification.user_id == current_user.id
        )
    )
    notif = result.scalar_one_or_none()
    if notif:
        notif.is_read = True
    return {"message": "Notifikasi ditandai dibaca"}
