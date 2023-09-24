import os

from pytest import MonkeyPatch
from dataclasses import dataclass, fields

from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.configs.staging import StagingHUUConfig

@dataclass(frozen=True)
class DebugTestConfig(DevelopmentHUUConfig):
    TESTING: bool = True
    FLASK_DEBUG: bool = True
    DATABASE_URL: str = 'sqlite:///:memory:'

    def __post_init__(self):
        with MonkeyPatch().context() as m:
            # The base config class reads the values from the
            # environment. Prevent this behavior for test cases
            # by clearing the environment using monkeypatching
            for env_var in os.environ.keys():
                m.delenv(env_var)
            super().__post_init__()

@dataclass(frozen=True)
class ReleaseTestConfig(StagingHUUConfig):
    TESTING: bool = True
    FLASK_DEBUG: bool = False
    DATABASE_URL: str = 'sqlite:///:memory:'