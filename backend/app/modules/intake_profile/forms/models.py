from typing import Annotated, Any
import datetime

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.schema import CheckConstraint
from sqlalchemy.sql import func

from app.core.db import Base
from app.modules.access.models import UserId

intpk = Annotated[int, mapped_column(primary_key=True)]


class Form(Base):
    __tablename__ = 'forms'
    form_id: Mapped[intpk]
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str]
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now())

    def get_field_ids(self) -> list[int]:
        return [
            field.field_id for group in self.field_groups
            for field in group.fields
        ]


class FieldProperties(Base):
    __tablename__ = 'field_properties'
    properties_id: Mapped[intpk]
    description: Mapped[str]
    field_type: Mapped[str] = mapped_column(nullable=False)
    choices: Mapped[dict[str, Any]]

    __table_args__ = (CheckConstraint(
        "field_type IN ('date', 'dropdown', 'multiple_choice', 'email', 'file_upload', 'group', 'long_text', 'number', 'short_text', 'yes_no')",
        name='chk_field_type'), )


class FieldValidations(Base):
    __tablename__ = 'field_validations'
    validations_id: Mapped[intpk]
    required: Mapped[bool] = mapped_column(nullable=False, default=False)
    max_length: Mapped[int]


class FieldGroup(Base):
    __tablename__ = 'field_groups'
    group_id: Mapped[intpk]
    form_id: Mapped[int] = mapped_column(ForeignKey('forms.form_id'),
                                         nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str]
    form = relationship("Form", back_populates="field_groups")


class Field(Base):
    __tablename__ = 'fields'
    field_id: Mapped[intpk]
    ref: Mapped[str] = mapped_column(nullable=False)
    properties_id: Mapped[int] = mapped_column(
        ForeignKey('field_properties.properties_id'), nullable=False)
    validations_id: Mapped[int] = mapped_column(
        ForeignKey('field_validations.validations_id'), nullable=False)
    group_id: Mapped[int] = mapped_column(ForeignKey('field_groups.group_id'))
    properties = relationship("FieldProperties")
    validations = relationship("FieldValidations")
    group = relationship("FieldGroup", back_populates="fields")


class Response(Base):
    __tablename__ = 'responses'
    answer_id: Mapped[intpk]
    user_id: Mapped[UserId] = mapped_column(ForeignKey('users.user_id'), nullable=False)
    field_id: Mapped[int] = mapped_column(ForeignKey('fields.field_id'),
                                          nullable=False)
    answer_text: Mapped[str]
    user = relationship("User")
    field = relationship("Field")


Form.field_groups = relationship("FieldGroup",
                                 order_by=FieldGroup.group_id,
                                 back_populates="form")
FieldGroup.fields = relationship("Field",
                                 order_by=Field.field_id,
                                 back_populates="group")
