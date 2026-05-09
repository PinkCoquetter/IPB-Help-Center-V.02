from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Category
from models.user import RoleEnum
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from utils.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/categories", tags=["Kategori"])


@router.get("/", response_model=List[CategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Daftar semua kategori (publik)"""
    result = await db.execute(select(Category).where(Category.is_active == True))
    return result.scalars().all()


@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Tambah kategori baru. Use Case: Mengelola Layanan Akademik"""
    exists = await db.execute(select(Category).where(Category.name == payload.name))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Kategori sudah ada")
    cat = Category(**payload.model_dump())
    db.add(cat)
    await db.flush()
    await db.refresh(cat)
    return cat


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Edit kategori."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    return cat


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.ADMIN)),
):
    """[Admin] Hapus (nonaktifkan) kategori."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")
    cat.is_active = False
