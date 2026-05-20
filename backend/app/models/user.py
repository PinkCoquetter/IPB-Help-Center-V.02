import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum as SAEnum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class RoleEnum(str, enum.Enum):
    STUDENT = "STUDENT"
    STAFF = "STAFF"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nim = Column(String(20), unique=True, nullable=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(RoleEnum), nullable=False, default=RoleEnum.STUDENT)
    division_id = Column(Integer, ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    division = relationship("Division", back_populates="users")
    tickets = relationship("Ticket", foreign_keys="Ticket.student_id", back_populates="student")
    handled_tickets = relationship("Ticket", foreign_keys="Ticket.assigned_staff_id", back_populates="assigned_staff")
    ticket_replies = relationship("TicketReply", back_populates="sender")
    notifications = relationship("Notification", back_populates="user")

    def __repr__(self):
        return f"<User {self.email} role={self.role}>"
