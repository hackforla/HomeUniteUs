from typing import Any


class Identity:
    """Represent identity value."""

    id: Any


class DomainEvent:
    """Represent a domain event"""

    def to_dict(self):
        return {
            'type': f"{self.__class__.__module__}.{self.__class__.__name__}",
            'data': self.__dict__,
        }
