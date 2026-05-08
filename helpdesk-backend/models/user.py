import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum as SAEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class RoleEnum(str, enum.Enum):
    MAHASISWA = "mahasiswa"
    STAFF = "staff"
    ADMIN = "admin"
    STAKEHOLDER = "stakeholder"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nim = Column(String(20), unique=True, nullable=True, index=True)        # Mahasiswa only
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(RoleEnum), nullable=False, default=RoleEnum.MAHASISWA)
    program_studi = Column(String(100), nullable=True)
    jabatan = Column(String(100), nullable=True)                             # Staff/Admin only
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tickets = relationship("Ticket", foreign_keys="Ticket.user_id", back_populates="user")
    handled_tickets = relationship("Ticket", foreign_keys="Ticket.assigned_staff_id", back_populates="assigned_staff")
    ticket_responses = relationship("TicketResponse", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

    def __repr__(self):
        return f"<User {self.email} role={self.role}>"
