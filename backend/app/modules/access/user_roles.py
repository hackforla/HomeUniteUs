from enum import Enum


class UserRole(Enum):
    ADMIN = "admin"
    GUEST = "guest"
    HOST = "host"
    COORDINATOR = "coordinator"


class UmatchedCaseStatus(Enum):
    IN_PROGRESS = "In Progress"
    COMPLETE = "Complete"
