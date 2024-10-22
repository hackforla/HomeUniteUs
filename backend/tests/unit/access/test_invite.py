from datetime import datetime, timedelta, timezone

import pytest

from app.modules.access.invite.contracts import (
    InviteId,
    SendInviteRequestedDomainEvent,
    InviteSentDomainEvent,
    InviteAcceptedDomainEvent,
    InviteAlreadySentException,
    NotInvitedException,
)
from app.modules.access.invite.invite_aggregate import Invite
from app.modules.access.schemas import UserRoleEnum


def then(given, when, expected_events):

    invite = Invite(given)
    when(invite)

    assert expected_events == invite.changes
    assert invite._state.pending_send_invite or invite._state.invited


def thenException(given, when, expected_exception_class):

    invite = Invite(given)
    with pytest.raises(expected_exception_class):
        when(invite)


def test_send_invite():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
    full_name = 'test name'
    email = 'test@email.com'
    invitee_role = UserRoleEnum.GUEST
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    sent_at = fixed_datetime

    expire_policy = lambda sent_at: sent_at + timedelta(days=7)
    token_gen = lambda email: 'token-' + email

    # Given
    given = []  # No prior events

    # When
    when = lambda invite: invite.send_invite(full_name=full_name,
                                             email=email,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             sent_at=sent_at,
                                             expire_policy=expire_policy)

    # Then
    expected_events = [
        SendInviteRequestedDomainEvent(full_name=full_name,
                                       email=email,
                                       invitee_role=invitee_role,
                                       inviter_id=inviter_id,
                                       inviter_role=inviter_role,
                                       sent_at=sent_at,
                                       expire_at=expire_policy(sent_at))
    ]
    then(given, when, expected_events)


def test_send_duplicate_pending_invite():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
    email = 'test@email.com'
    full_name = 'test name'
    invitee_role = UserRoleEnum.COORDINATOR
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    sent_at = fixed_datetime
    expire_at = fixed_datetime + timedelta(days=7)

    expire_policy = lambda sent_at: expire_at

    # Given
    given = [
        SendInviteRequestedDomainEvent(full_name=full_name,
                                       email=email,
                                       invitee_role=invitee_role,
                                       inviter_id=inviter_id,
                                       inviter_role=inviter_role,
                                       sent_at=sent_at,
                                       expire_at=expire_at)
    ]

    # When
    when = lambda invite: invite.send_invite(full_name=full_name,
                                             email=email,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             sent_at=sent_at,
                                             expire_policy=expire_policy)

    # Then
    thenException(given, when, InviteAlreadySentException)


def test_send_duplicate_sent_invite():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
    email = 'test@email.com'
    full_name = 'test name'
    invitee_role = UserRoleEnum.COORDINATOR
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    sent_at = fixed_datetime
    expire_at = fixed_datetime + timedelta(days=7)

    expire_policy = lambda sent_at: expire_at

    # Given
    given = [
        InviteSentDomainEvent(email=email,
                              full_name=full_name,
                              expire_at=expire_at)
    ]

    # When
    when = lambda invite: invite.send_invite(full_name=full_name,
                                             email=email,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             sent_at=sent_at,
                                             expire_policy=expire_policy)

    # Then
    thenException(given, when, InviteAlreadySentException)


def test_invite_accepted():

    # Setup
    email = 'test@email.com'
    full_name = 'test name'
    expire_at = datetime.now(timezone.utc) + timedelta(days=7)
    accepted_at = datetime.now(timezone.utc)

    # Given
    given = [
        InviteSentDomainEvent(email=email,
                              full_name=full_name,
                              expire_at=expire_at)
    ]

    # When
    when = lambda invite: invite.accept_invite(email=email,
                                               accepted_at=accepted_at)

    # Then
    expected_events = [
        InviteAcceptedDomainEvent(email=email, accepted_at=accepted_at)
    ]
    then(given, when, expected_events)


def test_uninvited_invite_accepted():

    # Setup
    email = 'test@email.com'
    accepted_at = datetime.now(timezone.utc)

    # Given
    given = []

    # When
    when = lambda invite: invite.accept_invite(email=email,
                                               accepted_at=datetime)

    # Then
    thenException(given, when, NotInvitedException)
