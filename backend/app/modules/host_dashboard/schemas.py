from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ContactInfoCreate(BaseModel):
    preferred_method: Optional[str] = Field(None, max_length=50)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=20)
    user_id: int

class ContactInfo(BaseModel):
    id: int
    preferred_method: Optional[str]
    phone_number: Optional[str]
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True
