from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.db import Base


class Form(Base):
    __tablename__ = 'forms'
    form_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())

    def get_field_ids(self) -> List[int]:
        return [
            field.field_id for group in self.field_groups
            for field in group.fields
        ]


class FieldProperties(Base):
    __tablename__ = 'field_properties'
    properties_id = Column(Integer, primary_key=True)
    description = Column(Text)
    field_type = Column(String(50), nullable=False)
    choices = Column(JSON)

    __table_args__ = (CheckConstraint(
        "field_type IN ('date', 'dropdown', 'multiple_choice', 'email', 'file_upload', 'group', 'long_text', 'number', 'short_text', 'yes_no')",
        name='chk_field_type'), )


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
    field_id = Column(Integer, primary_key=True)
    ref = Column(String(255), nullable=False)
    properties_id = Column(Integer,
                           ForeignKey('field_properties.properties_id'),
                           nullable=False)
    validations_id = Column(Integer,
                            ForeignKey('field_validations.validations_id'),
                            nullable=False)
    group_id = Column(Integer, ForeignKey('field_groups.group_id'))
    properties = relationship("FieldProperties")
    validations = relationship("FieldValidations")
    group = relationship("FieldGroup", back_populates="fields")


class Response(Base):
    __tablename__ = 'responses'
    answer_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    field_id = Column(Integer, ForeignKey('fields.field_id'), nullable=False)
    answer_text = Column(Text)
    user = relationship("User")
    field = relationship("Field")


Form.field_groups = relationship("FieldGroup",
                                 order_by=FieldGroup.group_id,
                                 back_populates="form")
FieldGroup.fields = relationship("Field",
                                 order_by=Field.field_id,
                                 back_populates="group")
