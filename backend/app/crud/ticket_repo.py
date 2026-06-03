from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.ticket import Ticket, TicketReply, TicketStatusEnum, TicketHistory

from typing import Optional

async def get_ticket_by_id(db: AsyncSession, ticket_id: int) -> Optional[Ticket]:
    """Mengambil detail tiket dari database beserta relasinya."""
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
    return result.scalar_one_or_none()

async def create_reply(db: AsyncSession, message: str, staff_id: int, ticket_id: int) -> TicketReply:
    """Menyimpan balasan tiket ke database."""
    reply = TicketReply(
        message=message,
        ticket_id=ticket_id,
        sender_id=staff_id,
    )
    db.add(reply)
    await db.flush() # Menggunakan flush agar ID-nya ter-generate tapi belum di-commit penuh
    return reply

async def update_ticket_status(db: AsyncSession, ticket: Ticket, new_status: TicketStatusEnum, changer_id: int):
    """Mengubah status tiket dan mencatatnya ke history."""
    old_status = ticket.status
    ticket.status = new_status  # type: ignore

    # Mencatat histori
    history = TicketHistory(
        ticket_id=ticket.id,
        old_status=old_status,
        new_status=new_status,
        changed_by=changer_id,
        note="Status diubah otomatis (Staff menanggapi)",
    )
    db.add(history)
    await db.flush()
    return ticket
