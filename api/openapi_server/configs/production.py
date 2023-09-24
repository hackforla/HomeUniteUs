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
        """
        Validates a secret key by checking multiple conditions:
        1) Minimum 16 characters
        2) At least one uppercase letter
        3) At least one lowercase letter
        4) At least one digit
        """
        errors = []
        if len(key) < 16:
            errors.append("The key must be at least 16 characters long.")

        if not re.search("[a-z]", key):
            errors.append("The key must contain at least one lowercase letter.")

        if not re.search("[A-Z]", key):
            errors.append("The key must contain at least one uppercase letter.")

        if not re.search("[0-9]", key):
            errors.append("The key must contain at least one digit.")

        if len(errors) > 0:
            raise ValueError(f"Production secret key '{key}' is not strong enough. "
                             f"{''.join(errors)}")