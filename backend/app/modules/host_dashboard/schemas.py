from pydantic import BaseModel, Field
from datetime import datetime

class ContactInfoCreate(BaseModel):
    preferred_method: str = Field(..., max_length=50)
    phone_number: str = Field(..., min_length=10, max_length=20)
    user_id: int

class ContactInfo(BaseModel):
    id: int
    preferred_method: str
    phone_number: str
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True
