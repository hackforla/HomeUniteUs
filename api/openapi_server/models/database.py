from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, declarative_base, relationship
# Avoid naming conflict with marshmallow.validates
from sqlalchemy.orm import validates as validates_sqlachemy
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import func
from sqlalchemy.schema import CheckConstraint
from sqlalchemy.types import JSON

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)
    firstName = Column(String(255), nullable=False)
    middleName = Column(String(255), nullable=True)
    lastName = Column(String(255), nullable=True)
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)
    role = relationship("Role", back_populates="users")
    responses = relationship("Response", back_populates="user")

    @validates_sqlachemy('firstName')
    def validate_first_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} must contain at least one non-space character")
        return value.strip()

class Role(Base):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
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

class Form(Base):
    __tablename__ = 'forms'
    form_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())

class FieldProperties(Base):
    __tablename__ = 'field_properties'
    properties_id = Column(Integer, primary_key=True)
    description = Column(Text)
    field_type = Column(String(50), nullable=False)
    choices = Column(JSON)  # Using native JSON support
    field_group = Column(JSON)  # Using native JSON support

    __table_args__ = (
        CheckConstraint(
            "field_type IN ('date', 'dropdown', 'multiple_choice', 'email', 'file_upload', 'group', 'long_text', 'number', 'short_text', 'yes_no')",
            name='chk_field_type'
        ),
    )

class FieldValidations(Base):
    __tablename__ = 'field_validations'
    validations_id = Column(Integer, primary_key=True)
    required = Column(Boolean, nullable=False, default=False)
    max_length = Column(Integer)  # NULL if not applicable

class FieldGroup(Base):
    __tablename__ = 'field_groups'
    group_id = Column(Integer, primary_key=True)
    form_id = Column(Integer, ForeignKey('forms.form_id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    form = relationship("Form", back_populates="field_groups")

class Field(Base):
    __tablename__ = 'fields'
    field_id = Column(String(255), primary_key=True)
    form_id = Column(Integer, ForeignKey('forms.form_id'), nullable=False)
    ref = Column(String(255), nullable=False)
    properties_id = Column(Integer, ForeignKey('field_properties.properties_id'), nullable=False)
    validations_id = Column(Integer, ForeignKey('field_validations.validations_id'), nullable=False)
    group_id = Column(Integer, ForeignKey('field_groups.group_id'))
    form = relationship("Form", back_populates="fields")
    properties = relationship("FieldProperties")
    validations = relationship("FieldValidations")
    group = relationship("FieldGroup", back_populates="fields")
    responses = relationship("Response", back_populates="field")

class Response(Base):
    __tablename__ = 'responses'
    answer_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    field_id = Column(String(255), ForeignKey('fields.field_id'), nullable=False)
    answer_text = Column(Text)
    user = relationship("User", back_populates="responses")
    field = relationship("Field", back_populates="responses")

Form.field_groups = relationship("FieldGroup", order_by=FieldGroup.group_id, back_populates="form")
Form.fields = relationship("Field", order_by=Field.field_id, back_populates="form")
FieldGroup.fields = relationship("Field", order_by=Field.field_id, back_populates="group")

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
