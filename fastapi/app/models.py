from sqlalchemy import Column, Integer, String

from database import Base


class Host(Base):
    __tablename__ = "hosts"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    middle_initial = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(Integer, nullable=False)
