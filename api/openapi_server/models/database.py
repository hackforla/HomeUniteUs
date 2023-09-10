from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, LargeBinary
from os import environ as env

DATABASE_URL = env.get('DATABASE_URL')

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)


class ApplicantType(Base):
    __tablename__ = "applicant_type"

    id = Column(Integer, primary_key=True, index=True)
    applicant_type_description = Column(String, nullable=False)


class ApplicantStatus(Base):
    __tablename__ = "applicant_status"

    id = Column(Integer, primary_key=True, index=True)
    applicant_type = Column(Integer, ForeignKey('applicant_type.id'), nullable=False)
    status_description = Column(String, nullable=False)


class Applicant(Base):
    __tablename__ = "applicant"

    id = Column(Integer, primary_key=True, index=True)
    applicant_type = Column(Integer, ForeignKey('applicant_type.id'), nullable=False)
    applicant_status = Column(Integer, ForeignKey('applicant_status.id'), nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)


class ApplicantStatusLog(Base):
    __tablename__ = "applicant_status_log"
    id = Column(Integer, primary_key=True, index=True)
    log_description = Column(String, nullable=False)
    logtime = Column(DateTime, nullable=False)
    applicant = Column(Integer, ForeignKey('applicant.id'), nullable=False)
    src_status = Column(Integer, ForeignKey('applicant_status.id'), nullable=False)
    dest_status = Column(Integer, ForeignKey('applicant_status.id'), nullable=False)


class IntakeQuestionType(Base):
    __tablename__ = "intake_question_type"

    id = Column(Integer, primary_key=True, index=True)
    type_description = Column(String, nullable=False)


class IntakeQuestion(Base):
    __tablename__ = "intake_question"

    id = Column(Integer, primary_key=True, index=True)
    applicant_type = Column(Integer, ForeignKey('applicant_type.id'), nullable=False)
    intake_question_type = Column(Integer, ForeignKey('intake_question_type.id'), nullable=False)
    intake_question_set = Column(Integer, ForeignKey('intake_question_set.id'), nullable=False)
    question_text = Column(String, nullable=False)


class IntakeResponseValue(Base):
    __tablename__ = "intake_response_value"

    id = Column(Integer, primary_key=True, index=True)

    intake_question = Column(Integer, ForeignKey('intake_question.id'), nullable=False)
    response_text = Column(String, nullable=False)


class MatchFailCondition(Base):
    __tablename__ = "match_fail_condition"

    id = Column(Integer, primary_key=True, index=True)

    response_value_a = Column(Integer, ForeignKey('intake_response_value.id'), nullable=False)
    response_value_b = Column(Integer, ForeignKey('intake_response_value.id'), nullable=False)
    reason_text = Column(String, nullable=False)


class MatchStatus(Base):
    __tablename__ = "match_status"

    id = Column(Integer, primary_key=True, index=True)
    status_description = Column(String, nullable=False)


class ApplicantUploadedImage(Base):
    __tablename__ = "applicant_uploaded_image"

    id = Column(Integer, primary_key=True, index=True)
    applicant = Column(Integer, ForeignKey('applicant.id'), nullable=False)
    image_data = Column(LargeBinary(length=5242880), nullable=False)
    

class ApplicantUploadedImageTag(Base):
    __tablename__ = "image_tag"

    id = Column(Integer, primary_key=True, index=True)
    applicant = Column(Integer, ForeignKey('applicant_uploaded_image.id'), nullable=False)
    image_tag_type = Column(Integer, ForeignKey('image_tag_type.id'), nullable=False)
    

class ImageTagType(Base):
    __tablename__ = "image_tag_type"

    id = Column(Integer, primary_key=True, index=True)
    tag_text = Column(String, nullable=False)
    tag_description = Column(String, nullable=False)
    

class MatchResult(Base):
    __tablename__ = "match_result"

    id = Column(Integer, primary_key=True, index=True)
    applicant_a = Column(Integer, ForeignKey('applicant.id'), nullable=False)
    applicant_b = Column(Integer, ForeignKey('applicant.id'), nullable=False)
    match_status = Column(Integer, ForeignKey('match_status.id'), nullable=False)


class GroupMatchResult(Base):
    __tablename__ = "group_match_result"

    id = Column(Integer, primary_key=True, index=True)
    guest_group = Column(Integer, ForeignKey('guest_group.id'), nullable=False)
    host_household = Column(Integer, ForeignKey('host_household.id'), nullable=False)
    match_status = Column(Integer, ForeignKey('match_status.id'), nullable=False)


class MatchFailure(Base):
    __tablename__ = "match_failure"

    id = Column(Integer, primary_key=True, index=True)
    match_result = Column(Integer, ForeignKey('match_result.id'), nullable=False)
    failed_condition = Column(Integer, ForeignKey('match_fail_condition.id'), nullable=False)

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

class IntakeQuestionSet(Base):
    __tablename__ = "intake_question_set"

    id = Column(Integer, primary_key=True, index=True)
    question_set_name = Column(String, nullable=False)
    housing_program = Column(Integer, ForeignKey('housing_program.id'), nullable=False)


class ProgramParticipant(Base):
    __tablename__ = "housing_program_pariticipant"  

    id = Column(Integer, primary_key=True, index=True)
    applicant = Column(Integer, ForeignKey('applicant.id'), nullable=False)
    housing_program = Column(Integer, ForeignKey('housing_program.id'), nullable=False)


class ProgramCoordinator(Base):
    __tablename__ = "program_coordinator"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    housing_program = Column(Integer, ForeignKey('housing_program.id'), nullable=False)


class GuestGroup(Base):
    __tablename__ = "guest_group"

    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, nullable=False)

class GuestGroupMember(Base):
    __tablename__ = "guest_group_member"

    id = Column(Integer, primary_key=True, index=True)

    guest_group = Column(Integer, ForeignKey('guest_group.id'), nullable=False)
    applicant = Column(Integer, ForeignKey('applicant.id'), nullable=False)

class Host(Base):
    __tablename__ = "host"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
class HostHousehold(Base):
    __tablename__ = "host_household"

    id = Column(Integer, primary_key=True, index=True)
    household_name = Column(String, nullable=False)

class HostHouseholdMember(Base):
    __tablename__ = "host_household_member"

    id = Column(Integer, primary_key=True, index=True)
    host_household = Column(Integer, ForeignKey('host_household.id'), nullable=False)
    applicant = Column(Integer, ForeignKey('applicant.id'), nullable=False)

class CaseStatus(Base):
    __tablename__ = "case_status"

    id = Column(Integer, primary_key=True, index=True)
    status_description = Column(String, nullable=False)

class ProgramCase(Base):
    __tablename__ = "program_case"

    id = Column(Integer, primary_key=True, index=True)
    coordinator = Column(Integer, ForeignKey('program_coordinator.id'), nullable=False)
    case_status = Column(Integer, ForeignKey('case_status.id'), nullable=False)
    host_household = Column(Integer, ForeignKey('host_household.id'), nullable=False)
    guest_group = Column(Integer, ForeignKey('guest_group.id'), nullable=False)

class ProgramCaseStatusLog(Base):
    __tablename__ = "program_case_log"

    id = Column(Integer, primary_key=True, index=True)
    log_description = Column(String, nullable=False)
    logtime = Column(DateTime, nullable=False)
    program_case = Column(Integer, ForeignKey('program_case.id'), nullable=False)
    src_status = Column(Integer, ForeignKey('case_status.id'), nullable=False)
    dest_status = Column(Integer, ForeignKey('case_status.id'), nullable=False)

class DataAccessLayer:
    _engine: Engine = None
    
    # temporary local sqlite DB, replace with conn str for postgres container port for real e2e
    _conn_string: str = DATABASE_URL if DATABASE_URL else "sqlite:///./homeuniteus.db"

    @classmethod
    def db_init(cls, conn_string=None):
        Base.metadata.create_all(bind=cls.get_engine(conn_string))
    
    @classmethod
    def connect(cls):
        return cls.get_engine().connect()
    
    @classmethod
    def get_engine(cls, conn_string=None) -> Engine:
        if cls._engine == None:
            cls._engine = create_engine(conn_string or cls._conn_string, echo=True, future=True)
        return cls._engine

    @classmethod 
    def session(cls) -> Session:
        return Session(cls.get_engine())