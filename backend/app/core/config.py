from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    COGNITO_CLIENT_ID: str
    COGNITO_CLIENT_SECRET: str
    COGNITO_REGION: str
    COGNITO_REDIRECT_URI: str
    COGNITO_USER_POOL_ID: str
    COGNITO_ACCESS_ID: str
    COGNITO_ACCESS_KEY: str
    ROOT_URL: str
    DATABASE_URL: str


@lru_cache
def get_settings():
    return Settings()