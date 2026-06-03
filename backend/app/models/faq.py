import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from app.models.base import Base

class FAQVisibilityEnum(str, enum.Enum):
    PUBLIC = "PUBLIC"
    STUDENT = "STUDENT"

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, default="Umum")
    visibility = Column(SAEnum(FAQVisibilityEnum), nullable=False, default=FAQVisibilityEnum.PUBLIC)  # type: ignore
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
