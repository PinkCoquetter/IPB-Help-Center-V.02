import os
import uuid
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from database import get_db
from models import User, Ticket, TicketResponse, TicketHistory, Document, Notification
from models.ticket import TicketStatusEnum, PriorityEnum
from models.notification import NotificationTypeEnum
from models.user import RoleEnum
from schemas.ticket import (
    TicketCreate, TicketStatusUpdate, TicketAssign, ReplyCreate,
    TicketListResponse, TicketDetailResponse, TicketReportResponse
)
from utils.auth import get_current_user, require_roles
from utils.ticket_number import generate_ticket_number
from config import settings

router = APIRouter(prefix="/api/tickets", tags=["Tiket"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "application/msword",
                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]


# ─── Helper: kirim notifikasi ────────────────────────────────────────────────
async def send_notification(
    db: AsyncSession,
    user_id: int,
    ticket_id: int,
    notif_type: NotificationTypeEnum,
    message: str,
):
    notif = Notification(
        message=message,
        type=notif_type,
        user_id=user_id,
        ticket_id=ticket_id,
    )
    db.add(notif)


# ─── POST /tickets — Buat tiket baru ─────────────────────────────────────────
@router.post("/", status_code=201)
async def create_ticket(
    payload: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    [Mahasiswa] Buat tiket baru.
    Use Case: Membuat Tiket
    """
    # Hitung queue number untuk hari ini
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    count_result = await db.execute(
        select(func.count(Ticket.id)).where(Ticket.created_at >= today_start)
    )
    today_count = count_result.scalar() or 0

    ticket = Ticket(
        ticket_number=generate_ticket_number(),
        queue_number=today_count + 1,
        subject=payload.subject,
        description=payload.description,
        category_id=payload.category_id,
        priority=payload.priority,
        user_id=current_user.id,
        status=TicketStatusEnum.OPEN,
    )
    db.add(ticket)
    await db.flush()

    # Catat history awal
    history = TicketHistory(
        ticket_id=ticket.id,
        old_status=None,
        new_status=TicketStatusEnum.OPEN,
        changed_by=current_user.id,
        note="Tiket dibuat oleh mahasiswa",
    )
    db.add(history)

    # Notifikasi ke seluruh staff (sederhana: notif ke pembuat bahwa tiket berhasil dibuat)
    await send_notification(
        db, current_user.id, ticket.id,
        NotificationTypeEnum.TIKET_BARU,
        f"Tiket #{ticket.ticket_number} berhasil dibuat. Status: Open.",
    )

    await db.flush()
    return {
        "message": "Tiket berhasil dibuat",
        "ticket_number": ticket.ticket_number,
        "queue_number": ticket.queue_number,
        "ticket_id": ticket.id,
    }


# ─── GET /tickets — Daftar tiket ─────────────────────────────────────────────
@router.get("/", response_model=List[TicketListResponse])
async def list_tickets(
    status: Optional[TicketStatusEnum] = None,
    category_id: Optional[int] = None,
    priority: Optional[PriorityEnum] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Daftar tiket.
    - Mahasiswa: hanya tiket milik sendiri
    - Staff/Admin: semua tiket
    Use Case: Melihat Daftar Tiket, Melihat Histori Tiket
    """
    query = select(Ticket)

    if current_user.role == RoleEnum.MAHASISWA:
        query = query.where(Ticket.user_id == current_user.id)

    if status:
        query = query.where(Ticket.status == status)
    if category_id:
        query = query.where(Ticket.category_id == category_id)
    if priority:
        query = query.where(Ticket.priority == priority)

    query = query.order_by(Ticket.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ─── GET /tickets/{id} — Detail tiket ────────────────────────────────────────
@router.get("/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket_detail(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    [Mahasiswa/Staff/Admin] Detail tiket beserta balasan, dokumen, dan histori.
    Use Case: Melihat Detail Tiket
    """
    result = await db.execute(
        select(Ticket)
        .options(
            selectinload(Ticket.user),
            selectinload(Ticket.assigned_staff),
            selectinload(Ticket.responses).selectinload(TicketResponse.user),
            selectinload(Ticket.history),
            selectinload(Ticket.documents),
        )
        .where(Ticket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")

    # Mahasiswa hanya bisa lihat tiketnya sendiri
    if current_user.role == RoleEnum.MAHASISWA and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak")

    return ticket


# ─── POST /tickets/{id}/reply — Balas tiket ──────────────────────────────────
@router.post("/{ticket_id}/reply", status_code=201)
async def reply_ticket(
    ticket_id: int,
    payload: ReplyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    [Staff/Mahasiswa] Balas tiket.
    Use Case: Menanggapi Tiket
    """
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    if ticket.status == TicketStatusEnum.DITUTUP:
        raise HTTPException(status_code=400, detail="Tiket sudah ditutup, tidak bisa dibalas")

    response = TicketResponse(
        message=payload.message,
        ticket_id=ticket_id,
        user_id=current_user.id,
    )
    db.add(response)
    await db.flush()

    # Notifikasi ke mahasiswa jika staff yang balas
    if current_user.role in [RoleEnum.STAFF, RoleEnum.ADMIN]:
        await send_notification(
            db, ticket.user_id, ticket_id,
            NotificationTypeEnum.BALASAN_BARU,
            f"Tiket #{ticket.ticket_number} mendapat balasan dari staff.",
        )

    return {"message": "Balasan berhasil dikirim"}


# ─── PATCH /tickets/{id}/status — Update status tiket ────────────────────────
@router.patch("/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: int,
    payload: TicketStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(
        require_roles(RoleEnum.STAFF, RoleEnum.ADMIN)
    ),
):
    """
    [Staff/Admin] Perbarui status tiket.
    Use Case: Memperbarui Status Tiket
    """
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    if ticket.status == TicketStatusEnum.DITUTUP:
        raise HTTPException(status_code=400, detail="Tiket sudah ditutup")

    old_status = ticket.status
    ticket.status = payload.status

    if payload.status == TicketStatusEnum.SELESAI:
        ticket.resolved_at = datetime.utcnow()

    # Catat history
    history = TicketHistory(
        ticket_id=ticket_id,
        old_status=old_status,
        new_status=payload.status,
        changed_by=current_user.id,
        note=payload.note,
    )
    db.add(history)

    # Mapping status → tipe notifikasi
    notif_map = {
        TicketStatusEnum.IN_PROGRESS: (NotificationTypeEnum.STATUS_DIPROSES, "sedang diproses"),
        TicketStatusEnum.SELESAI: (NotificationTypeEnum.STATUS_SELESAI, "telah selesai"),
        TicketStatusEnum.DITOLAK: (NotificationTypeEnum.STATUS_DITOLAK, "ditolak"),
    }
    if payload.status in notif_map:
        notif_type, label = notif_map[payload.status]
        await send_notification(
            db, ticket.user_id, ticket_id,
            notif_type,
            f"Tiket #{ticket.ticket_number} {label}.",
        )

    return {"message": f"Status tiket diperbarui menjadi {payload.status}"}


# ─── POST /tickets/{id}/close — Tutup tiket ──────────────────────────────────
@router.post("/{ticket_id}/close")
async def close_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.STAFF, RoleEnum.ADMIN)),
):
    """
    [Staff/Admin] Tutup tiket — hanya bisa jika status Selesai.
    Use Case: Menutup Tiket
    """
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    if ticket.status != TicketStatusEnum.SELESAI:
        raise HTTPException(status_code=400, detail="Tiket hanya bisa ditutup jika status Selesai")

    ticket.status = TicketStatusEnum.DITUTUP
    history = TicketHistory(
        ticket_id=ticket_id,
        old_status=TicketStatusEnum.SELESAI,
        new_status=TicketStatusEnum.DITUTUP,
        changed_by=current_user.id,
        note="Tiket ditutup oleh staff",
    )
    db.add(history)

    await send_notification(
        db, ticket.user_id, ticket_id,
        NotificationTypeEnum.STATUS_DITUTUP,
        f"Tiket #{ticket.ticket_number} telah ditutup.",
    )

    return {"message": "Tiket berhasil ditutup"}


# ─── POST /tickets/{id}/assign — Assign ke staff ─────────────────────────────
@router.post("/{ticket_id}/assign")
async def assign_ticket(
    ticket_id: int,
    payload: TicketAssign,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Assign tiket ke staff tertentu."""
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")

    staff_result = await db.execute(
        select(User).where(User.id == payload.staff_id, User.role == RoleEnum.STAFF)
    )
    staff = staff_result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff tidak ditemukan")

    ticket.assigned_staff_id = payload.staff_id
    return {"message": f"Tiket berhasil di-assign ke {staff.full_name}"}


# ─── POST /tickets/{id}/documents — Upload dokumen pendukung ─────────────────
@router.post("/{ticket_id}/documents", status_code=201)
async def upload_document(
    ticket_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    [Mahasiswa] Upload dokumen pendukung ke tiket.
    Use Case: Mengunggah Dokumen Pendukung
    """
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    if current_user.role == RoleEnum.MAHASISWA and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak")

    # Validasi tipe file
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak diizinkan. Gunakan: PDF, JPG, PNG, DOC, DOCX"
        )

    # Validasi ukuran
    content = await file.read()
    max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file melebihi batas {settings.MAX_FILE_SIZE_MB}MB"
        )

    # Simpan file
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    document = Document(
        file_name=unique_name,
        original_name=file.filename,
        file_type=file.content_type,
        file_size=len(content),
        file_path=file_path,
        ticket_id=ticket_id,
    )
    db.add(document)

    return {"message": "Dokumen berhasil diupload", "file_name": file.filename}


# ─── GET /tickets/report/summary — Laporan tiket ─────────────────────────────
@router.get("/report/summary", response_model=TicketReportResponse)
async def ticket_report(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.STAFF, RoleEnum.ADMIN, RoleEnum.STAKEHOLDER)),
):
    """
    [Staff/Admin/Stakeholder] Laporan ringkas tiket per periode.
    Use Case: Melihat Laporan Tiket
    """
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
    resolved = sum(1 for t in all_tickets if t.status == TicketStatusEnum.SELESAI)
    rejected = sum(1 for t in all_tickets if t.status == TicketStatusEnum.DITOLAK)
    closed = sum(1 for t in all_tickets if t.status == TicketStatusEnum.DITUTUP)

    # Rata-rata waktu penyelesaian (jam)
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
