"""This module defines marker classes for domain classes.

The classes defined here are used by domain classes to help identify
the general responsibility that they represent.
"""
from typing import Any


class Identity:
    """Represent identity value.

    Each aggregate and entity have a unique identity that is
    represented in the form of a property in its class definition.

    The data type of the identity will be specific to the class.
    For example, a Person class can have an identity represented
    as:

    class Person:
        personId: PersonId

    class PersonId(Identity):
        id: uuid.UUID
    """

    id: Any


class DomainCommand:
    """Representation for an intention to change state of the system.

    This is a marker class to identify classes as being Commands.
    """


class DomainEvent:
    """Represent a domain event.

    This is a marker class to identify classes as being Domain Events.
    """

    def to_dict(self):
        """Turn the class into a dictionary.

        This is used to help with JSON de/serialization.

        A class that inherits from this class must implement a
        class method that can convert a dictionary to an object
        of that class:

        class ExampleEvent(DomainEvent):
            example_property: int

            @classmethod
            def from_dict(cls, data: dict[str, Any]):
                return cls(example_property=int(data['example_property']))
        """
        return {
            'type': f"{self.__class__.__module__}.{self.__class__.__name__}",
            'data': self.__dict__,
        }
