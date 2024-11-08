"""This module defines marker classes for domain classes.

The classes defined here are used by domain classes to help identify
the general responsibility that they represent.
"""
from dataclasses import dataclass, asdict, replace, fields
from datetime import datetime, date, time
import decimal
from typing import Any, Type, TypeVar
import uuid


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


class ValueObject:
    """Represents a Value Object.

    A Value Object has significance to the domain and should be a valid
    representation of the type of thing it represents. It is also immutable.
    """


class DomainCommand:
    """Representation for an intention to change state of the system.

    This is a marker class to identify classes as being Commands.
    """


T = TypeVar("T", bound="DomainEvent")


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
        data = asdict(self)  # Converts dataclass fields to a dictionary

        # Convert types that aren't JSON serializable
        for key, value in data.items():
            data[key] = self._custom_serializer(value)

        return {
            'type': f"{self.__class__.__module__}.{self.__class__.__name__}",
            'data': data,
        }

    @classmethod
    def from_dict(cls: Type[T], data: dict[str, Any]) -> T:
        """Reconstruct an event from a dictionary."""
        init_data = data

        # Convert fields back from strings if necessary
        for field in fields(cls):
            field_name = field.name
            field_type = field.type
            if field_name in init_data:
                value = init_data[field_name]
                init_data[field_name] = cls._custom_deserializer(
                    value, field_type)

        return cls(**init_data)  # Automatically match the dataclass fields

    def _custom_serializer(self, obj):
        """Serialize certain Python types."""
        if isinstance(obj, (datetime, date, time)):
            return obj.isoformat()
        elif isinstance(obj, uuid.UUID):
            return str(obj)
        elif isinstance(obj, (set, frozenset)):
            return list(obj)
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        elif isinstance(obj, complex):
            return [obj.real, obj.imag]
        elif isinstance(obj, bytes):
            return obj.hex()
        else:
            return obj

    @classmethod
    def _custom_deserializer(cls, value, field_type):
        """De-serialize certain Python types."""
        if field_type is datetime and isinstance(value, str):
            return datetime.fromisoformat(value)
        elif field_type is uuid.UUID and isinstance(value, str):
            return uuid.UUID(value)
        elif field_type in {set, frozenset} and isinstance(value, list):
            return field_type(value)
        elif field_type is decimal.Decimal and isinstance(value, (float, str)):
            return decimal.Decimal(str(value))
        elif field_type is complex and isinstance(value,
                                                  list) and len(value) == 2:
            return complex(*value)
        elif field_type is bytes and isinstance(value, str):
            return bytes.fromhex(value)
        else:
            return value
