import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class TicketStatusEnum(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    SELESAI = "Selesai"
    DITOLAK = "Ditolak"
    DITUTUP = "Ditutup"


class PriorityEnum(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    URGENT = "Urgent"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String(30), unique=True, nullable=False, index=True)
    queue_number = Column(Integer, nullable=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SAEnum(TicketStatusEnum), default=TicketStatusEnum.OPEN, nullable=False)
    priority = Column(SAEnum(PriorityEnum), default=PriorityEnum.MEDIUM, nullable=False)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="tickets")
    assigned_staff = relationship("User", foreign_keys=[assigned_staff_id], back_populates="handled_tickets")
    category = relationship("Category", back_populates="tickets")
    responses = relationship("TicketResponse", back_populates="ticket", cascade="all, delete-orphan")
    history = relationship("TicketHistory", back_populates="ticket", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="ticket", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="ticket")

    def __repr__(self):
        return f"<Ticket #{self.ticket_number} status={self.status}>"


class TicketResponse(Base):
    __tablename__ = "ticket_responses"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    ticket = relationship("Ticket", back_populates="responses")
    user = relationship("User", back_populates="ticket_responses")

    def __repr__(self):
        return f"<TicketResponse ticket_id={self.ticket_id}>"


class TicketHistory(Base):
    __tablename__ = "ticket_history"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    old_status = Column(SAEnum(TicketStatusEnum), nullable=True)
    new_status = Column(SAEnum(TicketStatusEnum), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    note = Column(Text, nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    ticket = relationship("Ticket", back_populates="history")

    def __repr__(self):
        return f"<TicketHistory ticket_id={self.ticket_id} {self.old_status}->{self.new_status}>"
