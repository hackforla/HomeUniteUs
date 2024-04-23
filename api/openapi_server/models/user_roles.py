from enum import Enum

class UserRole(Enum):
    ADMIN = "Admin"
    GUEST = "Guest"
    HOST = "Host"
    COORDINATOR = "Coordinator"