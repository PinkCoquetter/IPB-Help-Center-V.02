from typing import Optional, List, Sequence, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from datetime import datetime
from app.models.ticket import Ticket, TicketReply, TicketHistory, TicketStatusEnum, PriorityEnum
from app.models.user import User, RoleEnum
from app.schemas.ticket import TicketCreate, TicketStatusUpdate, TicketReplyCreate
from app.models.notification import Notification, NotificationTypeEnum
from app.utils.ticket_number import generate_ticket_number
from app.crud import ticket_repo

async def create_notification(db: AsyncSession, user_id: Any, ticket_id: Any, notif_type: NotificationTypeEnum, title: str, message: str):
    notif = Notification(
        title=title,
        message=message,
        type=notif_type,
        user_id=user_id,
        ticket_id=ticket_id,
    )
    db.add(notif)

async def create_ticket(payload: TicketCreate, student: User, db: AsyncSession) -> Ticket:
    ticket = Ticket(
        ticket_number=generate_ticket_number(),
        title=payload.title,
        description=payload.description,
        category_id=payload.category_id,
        priority=payload.priority,
        student_id=student.id,
        status=TicketStatusEnum.OPEN,
    )
    db.add(ticket)
    await db.flush()

    history = TicketHistory(
        ticket_id=ticket.id,
        old_status=None,
        new_status=TicketStatusEnum.OPEN,
        changed_by=student.id,
        note="Ticket created by student",
    )
    db.add(history)

    await create_notification(
        db, student.id, ticket.id,
        NotificationTypeEnum.NEW_TICKET,
        "Ticket Created",
        f"Ticket #{ticket.ticket_number} has been created successfully."
    )

    await db.commit()
    await db.refresh(ticket)
    return ticket

async def get_tickets(
    db: AsyncSession,
    user: User,
    status: Optional[TicketStatusEnum] = None,
    category_id: Optional[int] = None,
    priority: Optional[PriorityEnum] = None,
    page: int = 1,
    limit: int = 10
) -> Sequence[Ticket]:
    query = select(Ticket).options(
        selectinload(Ticket.student),
        selectinload(Ticket.category)
    )

    if user.role == RoleEnum.STUDENT:  # type: ignore
        query = query.where(Ticket.student_id == user.id)

    if status:
        query = query.where(Ticket.status == status)
    if category_id:
        query = query.where(Ticket.category_id == category_id)
    if priority:
        query = query.where(Ticket.priority == priority)

    query = query.order_by(Ticket.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def get_ticket_detail(ticket_id: int, user: User, db: AsyncSession) -> Ticket:
    result = await db.execute(
        select(Ticket)
        .options(
            selectinload(Ticket.student),
            selectinload(Ticket.assigned_staff),
            selectinload(Ticket.category),
            selectinload(Ticket.replies).selectinload(TicketReply.sender),
            selectinload(Ticket.history),
            selectinload(Ticket.attachments),
        )
        .where(Ticket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if user.role == RoleEnum.STUDENT and ticket.student_id != user.id:  # type: ignore
        raise HTTPException(status_code=403, detail="Access denied")

    return ticket

async def reply_to_ticket(ticket_id: int, payload: TicketReplyCreate, user: User, db: AsyncSession):
    # [Service -> Repository] Meminta Repository mencari tiket
    # Kita menggunakan crud layer (ticket_repo) agar logika DB terpisah dari bisnis.
    
    ticket = await ticket_repo.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if user.role == RoleEnum.STUDENT and ticket.student_id != user.id:  # type: ignore
        raise HTTPException(status_code=403, detail="Access denied")

    # [Service] Pengecekan logika bisnis
    if ticket.status == TicketStatusEnum.CLOSED:  # type: ignore
        raise HTTPException(status_code=400, detail="Cannot reply to a closed ticket")

    # [Service -> Repository] Jika status masih OPEN, ubah jadi IN_PROGRESS (opsional)
    if ticket.status == TicketStatusEnum.OPEN and user.role in [RoleEnum.STAFF, RoleEnum.ADMIN]:  # type: ignore
        await ticket_repo.update_ticket_status(db, ticket, TicketStatusEnum.IN_PROGRESS, user.id)  # type: ignore

    # [Service -> Repository] Simpan balasan
    reply = await ticket_repo.create_reply(db, payload.message, user.id, ticket_id)  # type: ignore

    if user.role in [RoleEnum.STAFF, RoleEnum.ADMIN]:  # type: ignore
        await create_notification(
            db, ticket.student_id, ticket_id,  # type: ignore
            NotificationTypeEnum.NEW_REPLY,
            "New Reply",
            f"Staff has replied to your ticket #{ticket.ticket_number}."
        )

    # Transaksi commit di level service/controller
    await db.commit()
    return reply

async def update_ticket_status(ticket_id: int, payload: TicketStatusUpdate, user: User, db: AsyncSession):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.status == TicketStatusEnum.CLOSED:  # type: ignore
        raise HTTPException(status_code=400, detail="Ticket is already closed")

    old_status = ticket.status
    ticket.status = payload.status  # type: ignore

    if payload.status == TicketStatusEnum.RESOLVED:  # type: ignore
        ticket.resolved_at = func.now()  # type: ignore

    history = TicketHistory(
        ticket_id=ticket_id,
        old_status=old_status,
        new_status=payload.status,
        changed_by=user.id,  # type: ignore
        note=payload.note,
    )
    db.add(history)

    await create_notification(
        db, ticket.student_id, ticket_id,  # type: ignore
        NotificationTypeEnum.STATUS_UPDATED,
        "Status Updated",
        f"Your ticket #{ticket.ticket_number} status is now {payload.status.value}."
    )

    await db.commit()
    await db.refresh(ticket)
    return ticket
