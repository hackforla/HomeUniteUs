from typing import Protocol

import app.modules.access.schemas as schemas

class IDP(Protocol):
    def sign_up(self, user_to_sign_up: schemas.UserCreate):
        pass

    def sign_in(self, user_to_sign_in: schemas.UserSignInRequest):
        pass

    def session(self, email: str, refresh_token: str):
        pass

    def refresh(self, email: str, refresh_token: str):
        pass

    def forgot_password(self, email: str):
        pass

    def confirm_forgot_password(self, email, confirmation_code, password):
        pass

    def verify_claims(self, access_token: str, id_token: str):
        pass
