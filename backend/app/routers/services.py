from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.service import Service
from app.models.user import User, RoleEnum
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.dependencies.auth import require_roles

router = APIRouter(prefix="/api/services", tags=["Academic Services"])

@router.get("/", response_model=List[ServiceResponse])
async def list_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service).where(Service.is_active == True))
    return result.scalars().all()

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return svc

@router.post("/", response_model=ServiceResponse, status_code=201)
async def create_service(payload: ServiceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    svc = Service(**payload.model_dump())
    db.add(svc)
    await db.flush()
    await db.refresh(svc)
    return svc

@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: int, payload: ServiceUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(svc, field, value)
    return svc

@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.ADMIN))):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    svc.is_active = False  # type: ignore
    await db.flush()
