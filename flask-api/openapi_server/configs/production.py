from dataclasses import dataclass
import re

from openapi_server.configs.huu_config import HUUConfig, secret_str_field

@dataclass(frozen=True)
class ProductionHUUConfig(HUUConfig):
    ENV: str = "production"
    FLASK_DEBUG: bool = False
    TESTING: bool = False 
    SECRET_KEY: str = secret_str_field()
    DATABASE_URL: str = ""
    ROOT_URL: str = "homeunite.us"
    COGNITO_CLIENT_ID: str = secret_str_field()
    COGNITO_CLIENT_SECRET: str = secret_str_field()
    COGNITO_REGION: str = secret_str_field()
    COGNITO_REDIRECT_URI: str = secret_str_field()
    COGNITO_USER_POOL_ID: str = secret_str_field()
    COGNITO_ACCESS_ID: str = secret_str_field()
    COGNITO_ACCESS_KEY: str = secret_str_field()

    def post_validate(self):
        super().post_validate()
        self.validate_secret_key(self.SECRET_KEY)
        if (self.FLASK_DEBUG):
            raise ValueError("Debug mode is not supported by the production configuration.")
        if (self.TESTING):
            raise ValueError("Testing is not supported by the production configuration.")
        if (not self.DATABASE_URL):
            raise ValueError("DATABASE_URL must be specified as an environment variable.")

    def validate_secret_key(self, key):
        "Soft check to ensure the key is at least 32 characters long."
        if len(key) < 32:
            raise ValueError(f"Production secret key '{key}' is not strong enough. "
                             "The key must be at least 16 characters long.")