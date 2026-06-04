# mypy: ignore-errors
import os
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User, RoleEnum
from app.models.ticket import TicketStatusEnum, PriorityEnum, TicketAttachment
from app.schemas.ticket import TicketCreate, TicketStatusUpdate, TicketAssign, TicketReplyCreate, TicketListResponse, TicketDetailResponse
from app.dependencies.auth import get_current_user, require_roles
from app.services.ticket_service import create_ticket, get_tickets, get_ticket_detail, reply_to_ticket, update_ticket_status

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

@router.post("/", status_code=201)
async def create(payload: TicketCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.STUDENT))):
    ticket = await create_ticket(payload, current_user, db)
    return {"message": "Ticket created successfully", "ticket_number": ticket.ticket_number, "ticket_id": ticket.id}

@router.get("/me", response_model=List[TicketListResponse])
async def list_my_tickets(
    status: Optional[TicketStatusEnum] = None,
    category_id: Optional[int] = None,
    priority: Optional[PriorityEnum] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.STUDENT))
):
    return await get_tickets(db, current_user, status, category_id, priority, page, limit)

@router.get("/", response_model=List[TicketListResponse])
async def list_all_tickets(
    status: Optional[TicketStatusEnum] = None,
    category_id: Optional[int] = None,
    priority: Optional[PriorityEnum] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.STAFF, RoleEnum.ADMIN))
):
    return await get_tickets(db, current_user, status, category_id, priority, page, limit)

@router.get("/{ticket_id}", response_model=TicketDetailResponse)
async def get_detail(ticket_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_ticket_detail(ticket_id, current_user, db)

@router.post("/{ticket_id}/reply", status_code=201)
async def reply(ticket_id: int, payload: TicketReplyCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await reply_to_ticket(ticket_id, payload, current_user, db)
    return {"message": "Reply sent successfully"}

@router.patch("/{ticket_id}/status")
async def update_status(ticket_id: int, payload: TicketStatusUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.STAFF, RoleEnum.ADMIN))):
    await update_ticket_status(ticket_id, payload, current_user, db)
    return {"message": f"Status updated to {payload.status.value}"}

@router.post("/{ticket_id}/attachments", status_code=201)
async def upload_attachment(ticket_id: int, file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.STUDENT))):
    ticket = await get_ticket_detail(ticket_id, current_user, db)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
        
    content = await file.read()
    max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_FILE_SIZE_MB}MB limit")
        
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    
    with open(file_path, "wb") as f:
        f.write(content)
        
    attachment = TicketAttachment(file_name=file.filename, file_path=file_path, file_size=len(content), ticket_id=ticket.id)
    db.add(attachment)
    await db.commit()
    return {"message": "File uploaded successfully", "file_name": file.filename}

@router.post("/{ticket_id}/assign")
async def assign_ticket(ticket_id: int, payload: TicketAssign, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    from app.models.ticket import Ticket
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    staff_result = await db.execute(select(User).where(User.id == payload.staff_id, User.role == RoleEnum.STAFF))
    staff = staff_result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    ticket.assigned_staff_id = staff.id
    await db.commit()
    return {"message": f"Ticket assigned to {staff.full_name}"}
