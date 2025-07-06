from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from app.core.db import Base

class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    preferred_method = Column(String(50), nullable=True)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=True)
