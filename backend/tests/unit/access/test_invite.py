from app.modules.access.invite.contracts import (
    InviteId,
    InviteSentDomainEvent,
    InviteAcceptedDomainEvent,
    InviteAlreadySentException,
    UninvitedException,
)
from app.modules.access.invite.invite_aggregate import Invite

from datetime import datetime, timezone

import pytest


def then(given, when, expected_events):

    invite = Invite(given)
    when(invite)

    assert expected_events == invite.changes()
    assert invite._state.invited


def thenException(given, when, exception_class):

    invite = Invite(given)
    with pytest.raises(exception_class):
        when(invite)


def test_send_invite(monkeypatch):

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)

    class fakedatetime:

        @classmethod
        def now(cls, tzinfo):
            return fixed_datetime

    # Mock datetime.now to return the fixed_datetime
    monkeypatch.setattr(Invite.__module__ + '.datetime', fakedatetime)

    full_name = 'test name'
    email = 'test@email.com'
    invitee_role = 'Coordinator'
    sent_by = 'coordinators'

    token_gen = lambda email: email

    # Given
    # No prior events
    given = []

    # When
    when = lambda invite: invite.send_invite(full_name=full_name,
                                             email=email,
                                             invitee_role=invitee_role,
                                             sent_by=sent_by,
                                             token_gen=token_gen)

    # Then
    expected_events = [
        InviteSentDomainEvent(full_name=full_name,
                              email=email,
                              invitee_role=invitee_role,
                              sent_by=sent_by,
                              sent_at=fixed_datetime,
                              token=token_gen(email))
    ]
    then(given, when, expected_events)


def test_send_duplicate_invite():

    # Setup
    full_name = 'test name'
    email = 'test@email.com'
    invitee_role = 'Coordinator'
    sent_by = 'coordinators'

    token_gen = lambda email: email

    # Given
    given = [
        InviteSentDomainEvent(full_name=full_name,
                              email=email,
                              invitee_role=invitee_role,
                              sent_by=sent_by,
                              sent_at=datetime.now(timezone.utc),
                              token=token_gen(email))
    ]

    # When
    when = lambda invite: invite.send_invite(full_name=full_name,
                                             email=email,
                                             invitee_role=invitee_role,
                                             sent_by=sent_by,
                                             token_gen=token_gen)

    # Then
    thenException(given, when, InviteAlreadySentException)


def test_invite_accepted():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)

    full_name = 'test name'
    email = 'test@email.com'
    invitee_role = 'Coordinator'
    sent_by = 'coordinators'

    token_gen = lambda email: email

    # Given
    given = [
        InviteSentDomainEvent(full_name=full_name,
                              email=email,
                              invitee_role=invitee_role,
                              sent_by=sent_by,
                              sent_at=fixed_datetime,
                              token=token_gen(email))
    ]

    # When
    when = lambda invite: invite.accept_invite(email=email,
                                               token=token_gen(email))

    # Then
    expected_events = [
        InviteAcceptedDomainEvent(email=email, token=token_gen(email))
    ]
    then(given, when, expected_events)


def test_uninvited_invite_accepted():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)

    full_name = 'test name'
    email = 'test@email.com'
    invitee_role = 'Coordinator'
    sent_by = 'coordinators'

    token_gen = lambda email: email

    # Given
    given = []

    # When
    when = lambda invite: invite.accept_invite(email=email,
                                               token=token_gen(email))

    # Then
    thenException(given, when, UninvitedException)
