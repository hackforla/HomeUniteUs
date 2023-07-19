import importlib

'''
**READ ME**
Never put any sensitive information here i.e. credentials, secrets, etc.
'''

class Config():
    HOST = 'localhost'
    PORT = 8080
    DEBUG = True
    USE_RELOADER = True


# add class for new configuration profile here
# i.e. class ProductionConfig(Config) ...


def compile_config(profile: str, mod: str = 'configs.personal', clazz: str = 'PersonalConfig') -> Config:
    config = Config()

    if profile == 'personal':
        try:
            personal_mod = importlib.import_module(mod)
            personal_config = getattr(personal_mod, clazz)
            config = personal_config
        except ModuleNotFoundError:
            raise
    
    # handle other profiles here

    return config