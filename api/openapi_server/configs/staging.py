from dataclasses import dataclass

from openapi_server.configs.huu_config import HUUConfig, secret_str_field

@dataclass(frozen=True)
class StagingHUUConfig(HUUConfig):
    ENV: str = "staging"
    FLASK_DEBUG: bool = False
    TESTING: bool = False 
    SECRET_KEY: str = secret_str_field()
    DATABASE_URL: str = "sqlite:///./homeuniteus.db"
    ROOT_URL: str = "dev.homeunite.us"
    PORT: int = 8080
    HOST: str = "127.0.0.1"
    COGNITO_CLIENT_ID: str = secret_str_field()
    COGNITO_CLIENT_SECRET: str = secret_str_field()
    COGNITO_REGION: str = secret_str_field()
    COGNITO_REDIRECT_URI: str = secret_str_field()
    COGNITO_USER_POOL_ID: str = secret_str_field()
    COGNITO_ACCESS_ID: str = secret_str_field()
    COGNITO_ACCESS_KEY: str = secret_str_field()