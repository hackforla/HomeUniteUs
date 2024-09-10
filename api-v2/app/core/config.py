from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    COGNITO_CLIENT_ID: str
    COGNITO_CLIENT_SECRET: str
    COGNITO_REGION: str
    COGNITO_REDIRECT_URI: str
    COGNITO_USER_POOL_ID: str
    COGNITO_ACCESS_ID: str
    COGNITO_ACCESS_KEY: str
    SECRET_KEY: str
    CONFIG_PROFILE: str
    ROOT_URL: str
    ENV: str
    DATABASE_URL: str

    model_config = ConfigDict(env_file = ".env")


settings = Settings()
