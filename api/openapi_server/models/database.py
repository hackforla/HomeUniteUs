from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)

class HousingProgramServiceProvider(Base):
    __tablename__ = "housing_program_service_provider"  

    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, nullable=False)

    def __repr__(self):
        return f"HousingProgramServiceProvider(id={id},provider_name='{self.provider_name}')"

class HousingProgram(Base):
    __tablename__ = "housing_program"  

    id = Column(Integer, primary_key=True, index=True)
    program_name = Column(String, nullable=False)
    service_provider = Column(Integer, ForeignKey('housing_program_service_provider.id'), nullable=False)

class Host(Base):
    __tablename__ = "host"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class DataAccessLayer:
    _engine: Engine = None

    @classmethod
    def db_init(cls, conn_string):
        cls._engine = create_engine(conn_string, echo=True, future=True)
        Base.metadata.create_all(bind=cls._engine)

    @classmethod 
    def session(cls) -> Session:
        return Session(cls._engine)