from dataclasses import dataclass
from openapi_server.configs.huu_config import HUUConfig

@dataclass(frozen=True)
class DevelopmentHUUConfig(HUUConfig):
    ENV: str = "development"
    FLASK_DEBUG: bool = True
    PORT: int = 8080
    HOST: str = "127.0.0.1"
    TESTING: bool = False
    USE_RELOADER: bool = True
    SECRET_KEY: str = "unsecurekey"
    ROOT_URL: str = "http://localhost:4040"
    DATABASE_URL: str = "sqlite:///./homeuniteus.db"

    def post_validate(self):
        super().post_validate()
        if (self.PORT < 0 or self.PORT > 65535):
            raise ValueError("Port must be in the range 0-65535.")