from sqlalchemy import create_engine, Table, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.exc import SQLAlchemyError

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)
    firstName = Column(String(255), nullable=False)
    middleName = Column(String(255), nullable=True)
    lastName = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)
    role = relationship("Role", back_populates="users")

class Role(Base):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    users = relationship("User", back_populates="role")

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

class DataAccessLayer:
    _engine: Engine = None

    @classmethod
    def db_init(cls, conn_string):
        # Check that a database engine is not already set. The test project will 
        # hook into the DataAccessLayer to create a test project database engine.
        if cls._engine: return

        cls._engine = create_engine(conn_string, echo=True, future=True)
        Base.metadata.create_all(bind=cls._engine)

    @classmethod 
    def session(cls) -> Session:
        return Session(cls._engine)
    
    @classmethod
    def revision_id(cls) -> str:
        "Return the database alembic migration revision number."
        if not cls._engine: return ""
        try:
            with cls._engine.connect() as conn:
                # Using text() to ensure the query is treated as a literal SQL statement
                result = conn.execute(text("SELECT version_num FROM alembic_version"))
                revision_id = result.scalar()
                return revision_id
        except SQLAlchemyError:
            # This catches errors such as missing alembic_version table
            return ""
