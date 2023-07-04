from configs.configs import Config

'''
README:
- Name your config 'personal.py'
- Name your class 'PersonalConfig'. And inherit from the Config class i.e. PersonalConfig(Config).
'''
class PersonalConfigExample(Config):
    PORT = 8081
    DEBUG = False
    USE_RELOADER = False