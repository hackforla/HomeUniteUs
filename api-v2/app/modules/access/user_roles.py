from enum import Enum


class UserRole(Enum):
    ADMIN = "Admin"
    GUEST = "Guest"
    HOST = "Host"
    COORDINATOR = "Coordinator"


class UmatchedCaseStatus(Enum):
    IN_PROGRESS = "In Progress"
    COMPLETE = "Complete"
