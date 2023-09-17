from enum import Enum, auto
from typing import Union
from dotenv import load_dotenv, find_dotenv

from .huu_config import HUUConfig

class HUUConfigRegistry(Enum):
    DEVELOPMENT = auto()
    STAGING = auto()
    PRODUCTION = auto()

    @classmethod
    def available_environments(cls) -> str:
        return ",".join((env.name.lower() for env in cls))
    
    @classmethod
    def from_string(cls, parse_str: str) -> 'HUUConfigRegistry':
        try:
            return cls[parse_str.upper()]
        except KeyError:
            raise EnvironmentError(f"{parse_str} is not a valid environment. \
                                   Select one of the available options: \
                                   {cls.available_environments()}")
        
    @classmethod
    def load_config(cls, env: Union['HUUConfigRegistry', str]) -> HUUConfig:
        if isinstance(env, str):
            env = cls.from_string(env)

        env_file = find_dotenv()
        if env_file:
            # Load variables from a .env file and store as environment vars
            load_dotenv(env_file)

        match env:
            case HUUConfigRegistry.DEVELOPMENT:
                from .development import DevelopmentHUUConfig
                return DevelopmentHUUConfig()
            case HUUConfigRegistry.STAGING:
                from .staging import StagingHUUConfig
                return StagingHUUConfig()
            case HUUConfigRegistry.PRODUCTION:
                from .production import ProductionHUUConfig
                return ProductionHUUConfig()
            case _:
                raise EnvironmentError(f"{env} does not have a registered "
                                       "configuration type. Please update the "
                                       "load_config method to register this new "
                                       "environment type.")