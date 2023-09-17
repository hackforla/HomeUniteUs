from dataclasses import dataclass
from huu_config import HUUConfig

@dataclass(frozen=True)
class DevelopmentHUUConfig(HUUConfig):
    FLASK_ENV: str = 'development'
    FLASK_DEBUG: bool = True
    # We currently default to a publicly available 
    # server, but this has some security risks 
    # especially since we are not using https
    PORT: int = 8080
    HOST: str = "0.0.0.0"
    TESTING: bool = False
    USE_RELOADER: bool = True
    SECRET_KEY: str = "unsecurekey"
    ROOT_URL: str = "http://localhost:4040"
    DATABASE_URL: str = "sqlite:///./homeuniteus.db"

    def post_validate(self):
        super().post_validate()
        if (self.PORT < 0 or self.PORT > 65535):
            raise ValueError("Port must be in the range 0-65535.")