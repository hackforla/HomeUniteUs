from pytest import MonkeyPatch
from dataclasses import dataclass, fields

from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.configs.staging import StagingHUUConfig

@dataclass(frozen=True)
class DebugTestConfig(DevelopmentHUUConfig):
    FLASK_ENV: str = 'debug-test'
    TESTING: bool = True
    FLASK_DEBUG: bool = True
    DATABASE_URL: str = 'sqlite:///:memory:'

    def __post_init__(self):
        with MonkeyPatch().context() as m:
            # The base config class reads the values from the
            # environment. Prevent this behavior for test cases
            # by monkeypatching the environment, and setting the
            # monkeypatched variables to the current value
            for field in fields(self):
                m.setenv(field.name, getattr(self, field.name))
            super().__post_init__()

@dataclass(frozen=True)
class ReleaseTestConfig(StagingHUUConfig):
    FLASK_ENV: str = 'release-test'
    TESTING: bool = True
    FLASK_DEBUG: bool = False
    DATABASE_URL='sqlite:///:memory:'