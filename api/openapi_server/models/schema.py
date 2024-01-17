from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from openapi_server.models.database import *


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True


class ApplicantTypeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicantType
        include_relationships = True
        load_instance = True


class ApplicantStatusSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicantStatus
        include_relationships = True
        load_instance = True


class ApplicantSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Applicant
        include_relationships = True
        load_instance = True


class ApplicantStatusLogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicantStatusLog
        include_relationships = True
        load_instance = True


class IntakeQuestionTypeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = IntakeQuestionType
        include_relationships = True
        load_instance = True


class IntakeQuestionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = IntakeQuestion
        include_relationships = True
        load_instance = True


class IntakeResponseValueSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = IntakeResponseValue
        include_relationships = True
        load_instance = True


class MatchFailConditionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = MatchFailCondition
        include_relationships = True
        load_instance = True


class MatchStatusSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = MatchStatus
        include_relationships = True
        load_instance = True


class ApplicantUploadedImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicantUploadedImage
        include_relationships = True
        load_instance = True


class ApplicantUploadedImageTagSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicantUploadedImageTag
        include_relationships = True
        load_instance = True


class ImageTagTypeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ImageTagType
        include_relationships = True
        load_instance = True


class MatchResultSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = MatchResult
        include_relationships = True
        load_instance = True


class GroupMatchResultSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = GroupMatchResult
        include_relationships = True
        load_instance = True


class MatchFailureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = MatchFailure
        include_relationships = True
        load_instance = True


class HousingProgramServiceProviderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HousingProgramServiceProvider
        include_relationships = True
        load_instance = True


class HousingProgramSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HousingProgram
        include_relationships = True
        load_instance = True


class IntakeQuestionSetSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = IntakeQuestionSet
        include_relationships = True
        load_instance = True


class ProgramParticipantSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProgramParticipant
        include_relationships = True
        load_instance = True


class ProgramCoordinatorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProgramCoordinator
        include_relationships = True
        load_instance = True


class GuestGroupSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = GuestGroup
        include_relationships = True
        load_instance = True


class GuestGroupMemberSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = GuestGroupMember
        include_relationships = True
        load_instance = True


class HostSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Host
        include_relationships = True
        load_instance = True


class HostHouseholdSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HostHousehold
        include_relationships = True
        load_instance = True


class HostHouseholdMemberSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = HostHouseholdMember
        include_relationships = True
        load_instance = True


class CaseStatusSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CaseStatus
        include_relationships = True
        load_instance = True


class ProgramCaseSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProgramCase
        include_relationships = True
        load_instance = True


class ProgramCaseStatusLogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProgramCaseStatusLog
        include_relationships = True
        load_instance = True

host_schema = HostSchema()
hosts_schema = HostSchema(many=True)
service_provider_schema = HousingProgramServiceProviderSchema()
service_provider_list_schema = HousingProgramServiceProviderSchema(many=True)