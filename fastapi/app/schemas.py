from typing import List, Optional

from pydantic import BaseModel


class HostBase(BaseModel):
    email: str


class HostCreate(HostBase):
    pass


class Host(HostBase):
    id: int
    first_name: str
    middle_initial: str
    last_name: str
    date_of_birth: str
    phone: int

    class Config:
        orm_mode = True
