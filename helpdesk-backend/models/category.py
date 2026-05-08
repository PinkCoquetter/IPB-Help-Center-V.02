from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)  # Akademik, Fasilitas, dll.
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tickets = relationship("Ticket", back_populates="category")
    academic_services = relationship("AcademicService", back_populates="category")
    faqs = relationship("FAQ", back_populates="category")

    def __repr__(self):
        return f"<Category {self.name}>"
