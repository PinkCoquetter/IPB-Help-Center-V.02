from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class AcademicService(Base):
    __tablename__ = "academic_services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)          # Surat aktif, Cuti, dll.
    description = Column(Text, nullable=True)
    guide = Column(Text, nullable=True)                  # Panduan tiket
    is_active = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="academic_services")

    def __repr__(self):
        return f"<AcademicService {self.name}>"
