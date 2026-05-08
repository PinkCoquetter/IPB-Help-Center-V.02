import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class NotificationTypeEnum(str, enum.Enum):
    TIKET_BARU = "tiket_baru"
    STATUS_DIPROSES = "status_diproses"
    STATUS_SELESAI = "status_selesai"
    STATUS_DITOLAK = "status_ditolak"
    STATUS_DITUTUP = "status_ditutup"
    BALASAN_BARU = "balasan_baru"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    type = Column(SAEnum(NotificationTypeEnum), nullable=False)
    is_read = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")
    ticket = relationship("Ticket", back_populates="notifications")

    def __repr__(self):
        return f"<Notification type={self.type} user_id={self.user_id}>"
