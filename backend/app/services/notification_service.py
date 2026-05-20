from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.notification import Notification
from app.models.user import User

async def get_user_notifications(user: User, db: AsyncSession, limit: int = 50):
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()

async def mark_all_read(user: User, db: AsyncSession):
    await db.execute(
        update(Notification)
        .where(Notification.user_id == user.id, Notification.is_read == False)
        .values(is_read=True)
    )

async def mark_read(notif_id: int, user: User, db: AsyncSession):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notif_id,
            Notification.user_id == user.id
        )
    )
    notif = result.scalar_one_or_none()
    if notif:
        notif.is_read = True
