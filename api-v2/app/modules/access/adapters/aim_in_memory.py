import jwt
from datetime import datetime, timedelta

from app.core.config import Settings
import app.modules.access.adapters.aim_exceptions as aim_exceptions
import app.modules.access.adapters.cognito_groups as cognito_groups
import app.modules.access.schemas as schemas

from cryptography.hazmat.primitives.asymmetric import rsa

PRIVATE_KEY = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)


class AIMInMemory:

    def __init__(self, settings: Settings):
        self.users = {}
        self.settings = settings

    def sign_up(self, user_to_sign_up: schemas.UserCreate):
        if user_to_sign_up.email in self.users:
            raise aim_exceptions.SignUpUserError(
                Exception("User exists already"))
        self.users[user_to_sign_up.email] = user_to_sign_up
        return "OK?"

    def sign_in(self, user_to_sign_in: schemas.UserSignInRequest):
        if user_to_sign_in.email not in self.users:
            raise aim_exceptions.SignInError(code="SignInError",
                                             message="User doesn't exist.")

        user = self.users[user_to_sign_in.email]

        payload = {
            "exp": datetime.now() + timedelta(days=1),
            "token_use": "access",
        }
        access_token = jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")

        payload = {
            "email": user.email,
            "cognito:groups":
            [cognito_groups.role_to_cognito_group_map[user.role]],
            "token_use": "id",
        }
        id_token = jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")
        return {
            "access_token": access_token,
            "refresh_token": "refresh token",
            "id_token": id_token,
        }

    def session(self, email: str, refresh_token: str):
        payload = {
            "exp": datetime.now() + timedelta(days=1),
        }
        access_token = jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")
        return access_token

    def refresh(self, email: str, refresh_token: str):
        return self.session(email, refresh_token)

    def forgot_password(self, email: str):
        pass

    def confirm_forgot_password(self, email, confirmation_code, password):
        pass

    def verify_claims(self, access_token: str, id_token: str):
        return True
