from pydantic import BaseModel, ConfigDict


class FieldValidationsSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    required: bool
    max_length: int


# class FieldPropertiesSchema(BaseModel):

#     class Meta:
#         model = FieldProperties
#         include_relationships = True
#         load_instance = True
#         exclude = ('properties_id', )

#     description = auto_field()
#     field_type = auto_field()
#     choices = auto_field()


# class FieldSchema(BaseModel):

#     class Meta:
#         model = Field
#         include_relationships = True
#         load_instance = True
#         exclude = ('properties_id', 'validations_id', 'group_id')

#     field_id = auto_field(dump_only=True)
#     ref = auto_field()
#     properties = SmartNested(FieldPropertiesSchema)
#     validations = SmartNested(FieldValidationsSchema)


# class FieldGroupSchema(BaseModel):

#     class Meta:
#         model = FieldGroup
#         include_relationships = True
#         load_instance = True
#         exclude = ('group_id', 'form_id')

#     title = auto_field()
#     description = auto_field()
#     fields = SmartNested(FieldSchema, many=True)


# class FormSchema(BaseModel):

#     class Meta:
#         model = Form
#         include_relationships = True
#         load_instance = True
#         exclude = ('form_id', )

#     title = auto_field()
#     description = auto_field()
#     field_groups = SmartNested(FieldGroupSchema, many=True)


# class ResponseSchema(BaseModel):

#     class Meta:
#         model = Response
#         include_relationship = True
#         load_instance = True
#         exclude = ('answer_id', )

#     user_id = auto_field(load_only=True)
#     field_id = auto_field(load_only=True)
#     answer_text = auto_field()
#     user = SmartNested(UserSchema, only=['name'], required=False, missing=None)
#     field = SmartNested(FieldSchema,
#                         only=['field_id', 'ref', 'properties'],
#                         required=False,
#                         missing=None)

#     @post_load
#     def make_response(self, data, **kwargs):
#         if data.user is None:
#             user = self._session.query(User).get(data.user_id)
#             if not user:
#                 raise ValidationError('User not found', 'user_id')
#             data.user = user

#         if data.field is None:
#             field = self._session.query(Field).get(data.field_id)
#             if not field:
#                 raise ValidationError('Field not found', 'field_id')
#             data.field = field

#         return data


# form_schema = FormSchema()
# response_schema = ResponseSchema(many=True)
