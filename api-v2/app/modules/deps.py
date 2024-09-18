import boto3
import jwt
from functools import lru_cache

from typing import Annotated, Any

from fastapi import Depends, Request, HTTPException
from fastapi.security import SecurityScopes, OAuth2PasswordBearer
from sqlalchemy.orm import Session

import app.core.db as db
import app.core.config as config

from app.modules.access.adapters.cognito_groups import role_to_cognito_group_map
from app.modules.access.adapters.idp import IDP
import app.modules.access.adapters.idp_cognito as idp_cognito
import app.modules.access.adapters.idp_in_memory as idp_in_memory

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
    return boto3.client(
        "cognito-idp",
        region_name=settings.COGNITO_REGION,
        aws_access_key_id=settings.COGNITO_ACCESS_ID,
        aws_secret_access_key=settings.COGNITO_ACCESS_KEY,
    )


CognitoIdpDep = Annotated[Any, Depends(get_cognito_client)]

_idp = None


def get_idp(settings: SettingsDep, cognito_client: CognitoIdpDep):
    global _idp
    if _idp is None:
        if settings.ENV == config.Environments.PRODUCTION:
            _idp = idp_cognito.IDPCognito(settings, cognito_client)
        else:
            _idp = idp_in_memory.IDPInMemory(settings)

    return _idp


IdpDep = Annotated[IDP, Depends(get_idp)]


def requires_auth(request: Request, idp: IdpDep):
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

    # cookie has id token
    id_token = request.cookies.get("id_token")
    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    result = idp.verify_claims(access_token=decoded_access_token,
                               id_token=decoded_id_token)
    if not result:
        raise HTTPException(status_code=401, detail="Could not verify token.")

    return True


def allow_roles(request: Request, security_scopes: SecurityScopes):
    id_token = request.cookies.get("id_token")
    if id_token is None:
        raise HTTPException(status_code=401, detail="Missing id_token")

    decoded_id_token = jwt.decode(id_token,
                                  algorithms=["RS256"],
                                  options={"verify_signature": False})

    groups = decoded_id_token.get("cognito:groups")
    print(groups)
    contains_group = any(role_to_cognito_group_map[scope] in groups
                         for scope in security_scopes.scopes)

    if not contains_group:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return True


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

OAuthTokenDep = Annotated[str, Depends(oauth2_scheme)]
