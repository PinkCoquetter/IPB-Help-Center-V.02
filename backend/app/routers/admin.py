from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User, RoleEnum
from app.schemas.ticket import TicketReportResponse
from app.dependencies.auth import require_roles
from app.services.stats_service import get_dashboard_stats

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=TicketReportResponse)
async def get_stats(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.STAFF, RoleEnum.ADMIN))):
    return await get_dashboard_stats(db)

