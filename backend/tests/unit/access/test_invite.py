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
from app.modules.access.models import UserId, UserRoleEnum, User


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
    first_name = 'first'
    middle_name = 'middle'
    last_name = 'last'
    email = 'test@example.com'
    invitee_role = UserRoleEnum.GUEST
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    requested_at = fixed_datetime

    expire_policy = lambda requested_at: requested_at + timedelta(days=7)

    coordinator = User.coordinator(first_name='coordinator',
                                   middle_name=None,
                                   last_name='rotanidrooc',
                                   email='c@example.com')
    user_service = lambda id: coordinator

    # Given
    given = []  # No prior events

    # When
    when = lambda invite: invite.send_invite(email=email,
                                             first_name=first_name,
                                             middle_name=middle_name,
                                             last_name=last_name,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             requested_at=requested_at,
                                             expire_policy=expire_policy,
                                             user_service=user_service)

    # Then
    expected_events = [
        SendInviteRequestedDomainEvent(
            email=email,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            invitee_role=invitee_role,
            inviter_id=inviter_id,
            inviter_first_name=coordinator.first_name,
            inviter_middle_name=coordinator.middle_name,
            inviter_last_name=coordinator.last_name,
            inviter_role=inviter_role,
            requested_at=requested_at,
            expire_at=expire_policy(requested_at))
    ]
    then(given, when, expected_events)


def test_send_duplicate_pending_invite():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
    email = 'test@email.com'
    first_name = 'first'
    middle_name = None
    last_name = 'last'
    invitee_role = UserRoleEnum.COORDINATOR
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    requested_at = fixed_datetime
    expire_at = fixed_datetime + timedelta(days=7)

    expire_policy = lambda requested_at: expire_at

    coordinator = User.coordinator(first_name='coordinator',
                                   middle_name=None,
                                   last_name='rotanidrooc',
                                   email='c@example.com')
    user_service = lambda id: coordinator

    # Given
    given = [
        SendInviteRequestedDomainEvent(
            email=email,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            invitee_role=invitee_role,
            inviter_id=inviter_id,
            inviter_first_name=coordinator.first_name,
            inviter_middle_name=coordinator.middle_name,
            inviter_last_name=coordinator.last_name,
            inviter_role=inviter_role,
            requested_at=requested_at,
            expire_at=expire_at)
    ]

    # When
    when = lambda invite: invite.send_invite(email=email,
                                             first_name=first_name,
                                             middle_name=middle_name,
                                             last_name=last_name,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             requested_at=requested_at,
                                             expire_policy=expire_policy,
                                             user_service=user_service)

    # Then
    thenException(given, when, InviteAlreadySentException)


def test_send_duplicate_sent_invite():

    # Setup
    fixed_datetime = datetime(2020, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
    email = 'test@email.com'
    first_name = 'first'
    middle_name = None
    last_name = 'last'
    invitee_role = UserRoleEnum.COORDINATOR
    inviter_id = 'coordinator-id'
    inviter_role = UserRoleEnum.COORDINATOR
    requested_at = fixed_datetime
    expire_at = fixed_datetime + timedelta(days=7)

    expire_policy = lambda requested_at: expire_at

    coordinator = User.coordinator(first_name='coordinator',
                                   middle_name=None,
                                   last_name='rotanidrooc',
                                   email='c@example.com')
    user_service = lambda id: coordinator

    # Given
    given = [
        InviteSentDomainEvent(email=email,
                              first_name=first_name,
                              middle_name=middle_name,
                              last_name=last_name,
                              expire_at=expire_at)
    ]

    # When
    when = lambda invite: invite.send_invite(email=email,
                                             first_name=first_name,
                                             middle_name=middle_name,
                                             last_name=last_name,
                                             invitee_role=invitee_role,
                                             inviter_id=inviter_id,
                                             inviter_role=inviter_role,
                                             requested_at=requested_at,
                                             expire_policy=expire_policy,
                                             user_service=user_service)

    # Then
    thenException(given, when, InviteAlreadySentException)


def test_invite_accepted():

    # Setup
    email = 'test@email.com'
    first_name = 'first'
    middle_name = None
    last_name = 'last'
    expire_at = datetime.now(timezone.utc) + timedelta(days=7)
    accepted_at = datetime.now(timezone.utc)

    # Given
    given = [
        InviteSentDomainEvent(email=email,
                              first_name=first_name,
                              middle_name=middle_name,
                              last_name=last_name,
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
