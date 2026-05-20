import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User, RoleEnum
from app.models.ticket_category import TicketCategory
from app.core.security import hash_password

async def seed():
    async with AsyncSessionLocal() as session:
        # Create Admin
        admin = User(
            full_name="Admin Sistem",
            email="admin@ipb.ac.id",
            hashed_password=hash_password("admin123"),
            role=RoleEnum.ADMIN
        )
        session.add(admin)

        # Create Categories
        cats = [
            TicketCategory(name="Akademik", description="Layanan Administrasi Akademik"),
            TicketCategory(name="Keuangan", description="Layanan UKT dan Keuangan"),
            TicketCategory(name="IT Support", description="Layanan Akun dan Jaringan")
        ]
        session.add_all(cats)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
