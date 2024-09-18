import jwt
from datetime import datetime, timedelta

from app.core.config import Settings
import app.modules.access.adapters.aim_exceptions as aim_exceptions
import app.modules.access.adapters.cognito_groups as cognito_groups
import app.modules.access.schemas as schemas

PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCdjgEs5YgC9pkY3MarawFK9KIc3stNwgX8SmlZ9tyrFrqiebnG
wW5ys+lexfGiG0R7YrLCYPf3Bsv/BawVI+PxJFDcAb8lhp+n7jG1F0YvRAUjMaxY
HaC+hrMntxhDVx5T7uSYSwMJGeKJdh3RNg3UpIw3HfBAYf0qnG/bgSsxcwIDAQAB
AoGAa61/lCWS3SOX4mwQw1qwWX/zw3No0s3FtXVNpxSWH7+68gvrMbFFQNNArWrv
B3FHTmRX84y+K2/Tv4kq4I/U2gIV5W2N+liT2Lno4iM7J2q5/TRn1rJxppesP8kV
6aXCSjvMCwcA57iAPvgEEsj2VKNROmkGkRe4PNEfwbqXU9ECQQD7aEfQ+mK3aR+Y
I/gEOqSgcWrUz+Sc1esh2uHzPOXTBSO5BXnXEin4QutCnHZ75I6k5d5HAdOTxlUX
gEAY+qo1AkEAoG7RPF/ksCdPbvPwMZfU/8W+P1zlezBllDjVlXWuZ44j4x69aHnS
4W0v1/hnrDhmKvaMoe5bEv/EbAY2g4+iBwJAV1JKF3jQTtoxghuEKpvf0GZ0b8Rh
qGPYzqKC9oRBY0EWvk37mssRTsyXgERuFuw062t3//vPbDVoGsiN+t8dvQJAZpl4
RlwtLFp3ekWW/qBTH5+eo3cNa1LwI3KVZRf1iVRlrwIhr4b5TiE9z6iU5JbM//zc
w1Jj/CqFu2/dvRVGUQJAVhi8TYdfbiooObs0J+HAQ8uyV5h27Ep6f1OgYM2qy41O
kYGzhbqepuUGFOGBvH/PJF6IQ5gvUSiSqBupvArFxQ==
-----END RSA PRIVATE KEY-----"""


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
