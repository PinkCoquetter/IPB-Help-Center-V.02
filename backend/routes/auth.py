from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User
from schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    """Daftar akun baru (Mahasiswa / Staff / Admin)"""
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    if payload.nim:
        nim_check = await db.execute(select(User).where(User.nim == payload.nim))
        if nim_check.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="NIM sudah terdaftar")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        nim=payload.nim,
        role=payload.role,
        program_studi=payload.program_studi,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login — mendapatkan JWT token"""
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah"
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Akun tidak aktif")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Profil user yang sedang login"""
    return current_user
