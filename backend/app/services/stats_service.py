from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import Optional
from app.models.ticket import Ticket, TicketStatusEnum
from app.schemas.ticket import TicketReportResponse

async def get_dashboard_stats(db: AsyncSession, from_date: Optional[datetime] = None, to_date: Optional[datetime] = None) -> TicketReportResponse:
    base_query = select(Ticket)
    if from_date:
        base_query = base_query.where(Ticket.created_at >= from_date)
    if to_date:
        base_query = base_query.where(Ticket.created_at <= to_date)

    all_result = await db.execute(base_query)
    all_tickets = all_result.scalars().all()

    total = len(all_tickets)
    open_t = sum(1 for t in all_tickets if t.status == TicketStatusEnum.OPEN)
    in_progress = sum(1 for t in all_tickets if t.status == TicketStatusEnum.IN_PROGRESS)
    resolved = sum(1 for t in all_tickets if t.status == TicketStatusEnum.RESOLVED)
    rejected = sum(1 for t in all_tickets if t.status == TicketStatusEnum.REJECTED)
    closed = sum(1 for t in all_tickets if t.status == TicketStatusEnum.CLOSED)

    resolved_tickets = [t for t in all_tickets if t.resolved_at and t.created_at]
    avg_hours = None
    if resolved_tickets:
        total_hours = sum(
            (t.resolved_at - t.created_at.replace(tzinfo=t.resolved_at.tzinfo)).total_seconds() / 3600
            for t in resolved_tickets
        )
        avg_hours = round(total_hours / len(resolved_tickets), 2)

    return TicketReportResponse(
        total_tickets=total,
        open_tickets=open_t,
        in_progress_tickets=in_progress,
        resolved_tickets=resolved,
        rejected_tickets=rejected,
        closed_tickets=closed,
        avg_resolution_hours=avg_hours,
    )
