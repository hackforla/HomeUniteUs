from app.modules.access.models import EmailAddress, InvalidEmailError

import dataclasses
import pytest


@pytest.mark.parametrize(
    "test_input,expected",
    [("test@test.com", "test@test.com"),
     ("test@example.com", "test@example.com"),
     ("test+folder@example.co.uk", "test+folder@example.co.uk"),
     ("δοκιμή@παράδειγμα.δοκιμή", "δοκιμή@παράδειγμα.δοκιμή"),
     ("二ノ宮@黒川.日本", "二ノ宮@黒川.日本"),
     ("long.email-address-with-hyphens@and.subdomains.example.com",
      "long.email-address-with-hyphens@and.subdomains.example.com"),
     ('"john..doe"@example.org', '"john..doe"@example.org'),
     ("I❤️CHOCOLATE@example.com", "I❤️CHOCOLATE@example.com")])
def test_email_address_value_object(test_input, expected):
    email = EmailAddress.from_str(test_input)
    assert expected == str(email)
    assert expected == email.email
    assert expected == email


@pytest.mark.parametrize("test_input", [
    ("test@"), ("abc.example.com"), ("a@b@c@example.com"),
    ('"My Name" <me@example.com>'), ('this is"not\\allowed@example.com'),
    ("1234567890123456789012345678901234567890123456789012345678901234+x@example.com"
     )
])
def test_invalid_email_address(test_input):
    with pytest.raises(InvalidEmailError):
        EmailAddress.from_str(test_input)


def test_immutable():
    email = EmailAddress("test@test.com")
    with pytest.raises(dataclasses.FrozenInstanceError):
        email.email = "change@test.com"
