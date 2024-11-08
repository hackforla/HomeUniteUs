from typing import TypeVar

from .interfaces import DomainCommand, DomainEvent


Message = DomainCommand | DomainEvent


def handle(message: Message):
    match message:
        case DomainCommand():
            handle_command(message)
        case DomainEvent():
            handle_event(message)


def handle_event(event: DomainEvent):
    for handler in EVENT_HANDLERS[type(event)]:
        handler.mutate(event)


def handle_command(cmd: DomainCommand):
    for handler in COMMAND_HANDLERS[type(cmd)]:
        handler.execute(cmd)


DC = TypeVar('DC')
DE = TypeVar('DE')

COMMAND_HANDLERS: dict[DC, list[DomainCommand]] = {}

EVENT_HANDLERS: dict[DE, list[DomainEvent]] = {}
