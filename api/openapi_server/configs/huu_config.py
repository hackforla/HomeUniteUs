import os
from dataclasses import dataclass, field, fields
from typing import Any

def secret_str_field() -> field:
    """
    Used to identify configuration secrets. Secrets must be loaded from the
    environment. Attempts to hard code these values will throw an exception.
    """
    return field(default='', metadata={'is_secret': True})

@dataclass(frozen=True)
class HUUConfig:
    """
    Specifies the configuration settings needed for all HUU application environments.

    Environment variables from the system can override all preset values.
    """
    FLASK_DEBUG: bool
    TESTING: bool
    SECRET_KEY: str
    ROOT_URL: str
    DATABASE_URL: str

    # Define convenience aliases for FLASK_DEBUG.
    # This configuration option is treated specially by Flask. It must 
    # be loaded as an environment variable before constructing the Flask 
    # application instance in order to work properly

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
                cast_value = self.parse_env_variable(field, env_value)
                object.__setattr__(self, field.name, cast_value)

        self.post_validate()

    @staticmethod
    def parse_env_variable(field: field, env_var: str) -> Any:
        if (field.type == str):
            return env_var
        elif (field.type == bool):
            return env_var.lower() not in {"0", "false"}
        elif (field.type == int):
            try:
                return int(env_var)
            except ValueError:
                raise ValueError(f"Failed to parse {field.name}. "
                                 "This env var must be set to a valid integer")
        else:
            raise NotImplementedError("Unrecognized configuration field type")

    def pre_validate(self):
        '''
        Validate the configuration options before they are loaded
        from the process environment variables.

        All fields marked with a SecretStr type must be loaded from
        the environment. Attempts to hard code these values will result
        in a ValueError here.
        '''
        for field in fields(self):
            if (field.metadata.get("is_secret")):
                value = getattr(self, field.name)
                if (value != ''):
                    raise ValueError(f"Secret field {field.name} cannot have hard-coded values. "
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
        if not self.ROOT_URL:
            raise ValueError('ROOT_URL is not defined in the application configuration.')