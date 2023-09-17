import os
from dataclasses import dataclass, fields
from typing import TypeAlias

SecretStr: TypeAlias = str
"""
Used to identify configuration secrets. Secrets must be loaded from the
environment. Attempts to hard code these values will throw an exception.
"""

@dataclass(frozen=True)
class HUUConfig:
    """
    Specifies the configuration settings needed for all HUU application environments.

    Environment variables from the system can override all preset values.
    """
    FLASK_ENV: str
    FLASK_DEBUG: bool
    TESTING: bool
    SECRET_KEY: str
    ROOT_URL: str
    DATABASE_URL: str

    # Define convenience aliases for FLASK_ENV and FLASK_DEBUG.
    # These two configuration options are treated specially by Flask. They must 
    # be loaded as environment variables before constructing the Flask 
    # application instance in order to work properly

    @property 
    def ENV(self):
        return self.ENV

    @property 
    def DEBUG(self):
        return self.FLASK_DEBUG

    def __post_init__(self):
        '''
        Each time a configuration object is initialized, __post_init__
        will read the configuration options from the environment, 
        override the field values with the available environment values, 
        and validate the options using the pre_validate() and post_validate(). 
        '''
        self.pre_validate()

        for field in fields(self):
            env_value = os.environ.get(field.name)
            if env_value is not None:
                expected_type = type(getattr(self, field.name))
                cast_value = expected_type(env_value)
                object.__setattr__(self, field.name, cast_value)

        self.post_validate()

    def pre_validate(self):
        '''
        Validate the configuration options before they are loaded
        from the process environment variables.

        All fields marked with a SecretStr type must be loaded from
        the environment. Attempts to hard code these values will result
        in a ValueError here.
        '''
        for field in fields(self):
            if (field.type is SecretStr):
                value = getattr(self, field.name)
                if (value != ''):
                    raise ValueError("Secret fields cannot have hard-coded values. "
                                    "These must be loaded directly from an "
                                    "environment variable.")
                if (os.environ.get(field.name) is None):
                    raise ValueError(f"Configuration option {field.name} must "
                                 "be specified as an environment variable.")

    def post_validate(self):
        '''
        Validate the final configuration options, after overwriting
        the options using the process environment variables.
        '''
        pass