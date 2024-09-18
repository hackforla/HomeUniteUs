import hmac
import base64
import logging
import time

from botocore.exceptions import ClientError

import app.modules.access.adapters.idp_exceptions as idp_exceptions
from app.modules.access.adapters.cognito_groups import role_to_cognito_group_map
import app.modules.access.schemas as schemas
from app.core.config import Settings

logging = logging.Logger(__name__)


class IDPCognito:

    def __init__(self, settings: Settings, cognito_client):
        if cognito_client is None:
            raise Exception(
                "IDPCognito is not valid without a client for Cognito")
        if settings is None:
            raise Exception("IDPCognito is not valid without settings")

        self.cognito_client = cognito_client
        self.settings = settings

    def calc_secret_hash(self, username: str) -> str:
        message = username + self.settings.COGNITO_CLIENT_ID
        secret = bytearray(self.settings.COGNITO_CLIENT_SECRET, "utf-8")
        dig = hmac.new(secret, msg=message.encode("utf-8"),
                       digestmod="sha256").digest()
        return base64.b64encode(dig).decode()

        return hash

    def sign_up(self, user_to_sign_up: schemas.UserCreate):
        # Add user to cognito
        try:
            response = self.cognito_client.sign_up(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                SecretHash=self.calc_secret_hash(user_to_sign_up.email),
                Username=user_to_sign_up.email,
                Password=user_to_sign_up.password,
                ClientMetadata={"url": self.settings.ROOT_URL},
            )
        except Exception as e:
            logging.error(f"Failed to create user: {e}")
            raise idp_exceptions.SignUpUserError(e)

        # Add user to group
        try:
            group = role_to_cognito_group_map[user_to_sign_up.role]
            self.cognito_client.admin_add_user_to_group(
                UserPoolId=self.settings.COGNITO_USER_POOL_ID,
                Username=user_to_sign_up.email,
                GroupName=group,
            )
        except Exception as e:
            logging.error(f"Failed to add user to group {group}: {e}")
            raise idp_exceptions.SignUpUserError(e)

        return response

    def sign_in(self, user_to_sign_in: schemas.UserSignInRequest):
        try:
            auth_response = self.cognito_client.initiate_auth(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": user_to_sign_in.email,
                    "PASSWORD": user_to_sign_in.password,
                    "SECRET_HASH":
                    self.calc_secret_hash(user_to_sign_in.email),
                },
            )
        except ClientError as e:
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise idp_exceptions.SignInError(code=code, message=message)

        if (auth_response.get("ChallengeName")
                and auth_response["ChallengeName"] == "NEW_PASSWORD_REQUIRED"):
            user_id = auth_response["ChallengeParameters"]["USER_ID_FOR_SRP"]
            session_id = auth_response["Session"]
            root_url = self.settings.ROOT_URL

            return {
                "redirect":
                f"{root_url}/create-password?userId={user_id}&sessionId={session_id}"
            }

        access_token = auth_response["AuthenticationResult"]["AccessToken"]
        refresh_token = auth_response["AuthenticationResult"]["RefreshToken"]
        id_token = auth_response["AuthenticationResult"]["IdToken"]
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "id_token": id_token,
        }

    def session(self, email: str, refresh_token: str):
        try:
            auth_response = self.cognito_client.initiate_auth(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                AuthFlow='REFRESH_TOKEN',
                AuthParameters={
                    'REFRESH_TOKEN': refresh_token,
                    'SECRET_HASH': self.calc_secret_hash(email)
                })
        except ClientError as e:
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise idp_exceptions.SessionError(code=code, message=message)

        return auth_response['AuthenticationResult']['AccessToken']

    def refresh(self, email: str, refresh_token: str):
        try:
            auth_response = self.cognito_client.initiate_auth(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                AuthFlow='REFRESH_TOKEN',
                AuthParameters={
                    'REFRESH_TOKEN': refresh_token,
                    'SECRET_HASH': self.calc_secret_hash(email)
                })
        except ClientError as e:
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise idp_exceptions.RefreshError(code=code, message=message)

        return auth_response['AuthenticationResult']['AccessToken']

    def forgot_password(self, email: str):
        try:
            self.cognito_client.forgot_password(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                SecretHash=self.calc_secret_hash(email),
                Username=email)
        except ClientError as e:
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise idp_exceptions.ForgotPasswordError(code=code,
                                                     message=message)

    def confirm_forgot_password(self, email, confirmation_code, password):
        try:
            self.cognito_client.confirm_forgot_password(
                ClientId=self.settings.COGNITO_CLIENT_ID,
                SecretHash=self.calc_secret_hash(email),
                Username=email,
                ConfirmationCode=confirmation_code,
                Password=password)
        except ClientError as e:
            code = e.response['Error']['Code']
            message = e.response['Error']['Message']
            raise idp_exceptions.ConfirmForgotPasswordError(code=code,
                                                            message=message)

    def verify_claims(self, access_token, id_token):
        # 1. Check if token is expired
        if access_token["exp"] < time.time():
            return False

        # 2. The aud claim in an ID token and the client_id claim in an access
        # token should match the app client ID that was created in the Amazon Cognito user pool.
        if id_token["aud"] != self.settings.COGNITO_CLIENT_ID or access_token[
                "client_id"] != self.settings.COGNITO_CLIENT_ID:
            return False

        # 3. The issuer (iss) claim should match your user pool. For example,
        # a user pool created in the us-east-1 Region will have the following iss value:
        #     https://cognito-idp.us-east-1.amazonaws.com/<userpoolID>.
        if access_token[
                "iss"] != "https://cognito-idp.{settings.COGNITO_REGION}.amazonaws.com/{settings.COGNITO_USER_POOL_ID}":
            return False

        # 4. Check the token_use claim.
        #   If you are only accepting the access token in your web API operations, its value must be access.
        #   If you are only using the ID token, its value must be id.
        #   If you are using both ID and access tokens, the token_use claim must be either id or access.
        if access_token["token_use"] != "access" and id_token[
                "token_use"] != "id":
            return False
