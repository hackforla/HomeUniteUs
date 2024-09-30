from enum import Enum


class UserRole(Enum):
    ADMIN = "admin"
    GUEST = "guest"
    HOST = "host"
    COORDINATOR = "coordinator"
