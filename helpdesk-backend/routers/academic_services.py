from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import AcademicService
from models.user import RoleEnum
from schemas.academic_service import AcademicServiceCreate, AcademicServiceUpdate, AcademicServiceResponse
from utils.auth import require_roles

router = APIRouter(prefix="/api/services", tags=["Layanan Akademik"])


@router.get("/", response_model=List[AcademicServiceResponse])
async def list_services(db: AsyncSession = Depends(get_db)):
    """
    Daftar semua layanan akademik aktif (publik).
    Use Case: Melihat Daftar Layanan Akademik
    """
    result = await db.execute(select(AcademicService).where(AcademicService.is_active == True))
    return result.scalars().all()


@router.get("/{service_id}", response_model=AcademicServiceResponse)
async def get_service(service_id: int, db: AsyncSession = Depends(get_db)):
    """
    Detail layanan + panduan.
    Use Case: Membaca Panduan Layanan
    """
    result = await db.execute(select(AcademicService).where(AcademicService.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    return svc


@router.post("/", response_model=AcademicServiceResponse, status_code=201)
async def create_service(
    payload: AcademicServiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Tambah layanan akademik. Use Case: Mengelola Layanan Akademik"""
    svc = AcademicService(**payload.model_dump())
    db.add(svc)
    await db.flush()
    await db.refresh(svc)
    return svc


@router.put("/{service_id}", response_model=AcademicServiceResponse)
async def update_service(
    service_id: int,
    payload: AcademicServiceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Edit layanan akademik."""
    result = await db.execute(select(AcademicService).where(AcademicService.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(svc, field, value)
    return svc


@router.delete("/{service_id}", status_code=204)
async def delete_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Nonaktifkan layanan."""
    result = await db.execute(select(AcademicService).where(AcademicService.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    svc.is_active = False
