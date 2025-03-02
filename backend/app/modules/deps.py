import boto3

import jwt
import time
import hmac
import base64

from typing import Annotated, Any, Callable

from fastapi import Depends, Request, HTTPException
from fastapi.security import SecurityScopes
from sqlalchemy.orm import Session

import app.core.db as db
import app.core.config as config

################################################################################
# Loading forms JSON description from disk
FORM_1 = None
FORM_2 = None


def get_form_1():
    global FORM_1
    if FORM_1 is None:
        import json
        with open("form_data/form1.json", "r") as f:
            FORM_1 = json.load(f)
    return FORM_1


def get_form_2():
    global FORM_2
    if FORM_2 is None:
        import json
        with open("form_data/form2.json", "r") as f:
            FORM_2 = json.load(f)
    return FORM_2
################################################################################

SettingsDep = Annotated[config.Settings, Depends(config.get_settings)]


def db_engine(settings: SettingsDep):
    return db.db_engine(settings)


DbEngineDep = Annotated[Any, Depends(db_engine)]


def db_session(engine: DbEngineDep):
    session_factory = db.db_session_factory(engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


DbSessionDep = Annotated[Session, Depends(db_session)]

def get_cognito_client(settings: SettingsDep):
    # if this is running in ECS, we need to not set aws_access_key_id and aws_secret_access_key
    if (len(self.config["COGNITO_ACCESS_ID"] || "") == 0 or len(self.config["COGNITO_ACCESS_ID"] || "") == 0)
        return boto3.client('cognito-idp')

    cognito_client = boto3.client(
        "cognito-idp",
        region_name=settings.COGNITO_REGION,
        aws_access_key_id=settings.COGNITO_ACCESS_ID,
        aws_secret_access_key=settings.COGNITO_ACCESS_KEY,
        endpoint_url=settings.COGNITO_IDP_ENDPOINT_URL
    )
    return cognito_client

CognitoIdpDep = Annotated[Any, Depends(get_cognito_client)]

def requires_auth(request: Request, cognito_client: CognitoIdpDep):
    # Check for Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header is None:
        raise HTTPException(status_code=401,
                            detail="Missing Authorization header")

    # Check for Bearer token
    token = auth_header.split(" ")[1]
    if token is None:
        raise HTTPException(status_code=401, detail="Missing token")

    # Decode token
    decoded_access_token = jwt.decode(token,
                                      algorithms=["RS256"],
                                      options={"verify_signature": False})

    # Check if token is expired
    if decoded_access_token["exp"] < time.time():
        raise HTTPException(status_code=401, detail="Token expired")

    try:
        cognito_client.get_user(AccessToken=token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    return True


role_to_cognito_group_map = {
    "admin": "Admins",
    "host": "Hosts",
    "coordinator": "Coordinators",
    "guest": "Guests",
}


def allow_roles(request: Request, security_scopes: SecurityScopes):
    id_token = request.cookies.get("id_token")
    if id_token is None:
        raise HTTPException(status_code=401, detail="Missing id_token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    groups = decoded_id_token.get("cognito:groups")
    contains_group = any(role_to_cognito_group_map[scope] in groups
                         for scope in security_scopes.scopes)

    if not contains_group:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return True


def secret_hash_func(settings: SettingsDep):

    def hash(username: str) -> str:
        message = username + settings.COGNITO_CLIENT_ID
        secret = bytearray(settings.COGNITO_CLIENT_SECRET, "utf-8")
        dig = hmac.new(secret, msg=message.encode("utf-8"),
                       digestmod="sha256").digest()
        return base64.b64encode(dig).decode()

    return hash


SecretHashFuncDep = Annotated[Callable, Depends(secret_hash_func)]
