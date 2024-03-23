import pytest
from pytest import MonkeyPatch
from sqlalchemy.engine import make_url

from openapi_server.app import create_app, HUUFlaskApp, HUUConnexionApp
from openapi_server.configs.production import ProductionHUUConfig
from openapi_server.configs.development import DevelopmentHUUConfig
from openapi_server.models.database import DataAccessLayer 

def create_dev_app() -> HUUConnexionApp:
    '''
    Create our app without reading the .env file. The DevelopmentHUUConfig
    will read values from the environment, so monkey patching can be used 
    to set the values.
    '''
    return create_app(DevelopmentHUUConfig())

def create_prod_app() -> HUUConnexionApp:
    '''
    Create the production app without reading the .env file.
    Fake production secrets must be set using monkey patching, otherwise
    the production configuration will raise errors during its 
    internal validation.
    '''
    return create_app(ProductionHUUConfig())

def test_create_app_default_dev(empty_db_session, empty_environment: MonkeyPatch):
    '''
    Test that create_app with development config creates a Flask app with  
    a default development configuration, available as app.config.
    '''
    connexion_app = create_app(DevelopmentHUUConfig())
    config = connexion_app.app.config
    
    assert "DATABASE_URL" in config
    assert "PORT" in config 
    assert "HOST" in config 
    assert "TESTING" in config
    assert "SECRET_KEY" in config
    assert "ROOT_URL" in config 
    
    for key in config:
        assert "cognito" not in key.lower()

    assert make_url(config["DATABASE_URL"]) is not None
    assert isinstance(config["PORT"], int)
    assert config["PORT"] > 0 and config["PORT"] <= 65535
    assert config["ROOT_URL"]

def test_flask_app_override(empty_db_session, empty_environment: MonkeyPatch):
    '''
    Test that the create_app properly overrides the connexion app constructor
    to return our custom application type that contains global configuration.
    '''
    connexion_app = create_app(DevelopmentHUUConfig())
    assert isinstance(connexion_app, HUUConnexionApp)
    assert isinstance(connexion_app.app, HUUFlaskApp)

def test_missing_secret_throws_err(fake_prod_env: MonkeyPatch):
    '''
    Test that failing to set a configuration field that is marked as a 
    secret field throws an error.
    '''
    fake_prod_env.delenv("SECRET_KEY")
    with pytest.raises(ValueError):
        create_app(ProductionHUUConfig())

def test_hardcoding_secret_throws_err(fake_prod_env: MonkeyPatch):
    def check_with_hardcoded_secret(**kwargs):
        with pytest.raises(ValueError):
            ProductionHUUConfig(**kwargs)

    check_with_hardcoded_secret(SECRET_KEY="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_CLIENT_ID="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_CLIENT_SECRET="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_REGION="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_REDIRECT_URI="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_USER_POOL_ID="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_ACCESS_ID="My Hard Coded Fake Secret")
    check_with_hardcoded_secret(COGNITO_ACCESS_KEY="My Hard Coded Fake Secret")
    
def test_config_reads_from_env(empty_db_session, empty_environment: MonkeyPatch):
    '''
    Test that hard-coded values are overwritten using values from the system
    environment variables. 
    '''
    env_port = 9000
    hardcoded_port = 7777
    env_DEBUG = False 
    hardcoded_DEBUG = True 
    env_secret = "Extremely Cryptographically Insecure Key"
    hardcoded_secret = "Equally Insecure Key"

    empty_environment.setenv("FLASK_DEBUG", str(env_DEBUG))
    empty_environment.setenv("PORT", str(env_port))
    empty_environment.setenv("SECRET_KEY", env_secret)

    config = DevelopmentHUUConfig(
        FLASK_DEBUG=hardcoded_DEBUG,
        PORT=hardcoded_port,
        SECRET_KEY=hardcoded_secret
    )

    assert config.FLASK_DEBUG == env_DEBUG
    assert config.PORT == env_port
    assert config.SECRET_KEY == env_secret

    app = create_app(config).app
    app_config = app.config

    assert app_config["DEBUG"] == env_DEBUG
    assert app_config["PORT"] == env_port
    assert app_config["SECRET_KEY"] == env_secret
    assert app.is_debug_app == env_DEBUG

def test_invalid_port_throws(empty_environment: MonkeyPatch):
    empty_environment.setenv("PORT", "-1")
    with pytest.raises(ValueError):
        create_dev_app()
    empty_environment.setenv("PORT", "66000")
    with pytest.raises(ValueError):
        create_dev_app()

def test_env_var_bool_parsing(empty_db_session, empty_environment: MonkeyPatch):
    def check_bool_parsing(actual: str, expected: bool, msg: str):
        empty_environment.setenv("FLASK_DEBUG", actual)
        assert create_dev_app().app.config["FLASK_DEBUG"] == expected, msg

    check_bool_parsing("True", True, "match case")
    check_bool_parsing("true", True, "lower case")
    check_bool_parsing("1", True, "one")
    check_bool_parsing("tRuE", True, "mixed case")
    check_bool_parsing("    True  ", True, "extra padding")

    check_bool_parsing("False", False, "match case")
    check_bool_parsing("false", False, "lower case")
    check_bool_parsing("0", False, "zero")
    check_bool_parsing("fAlSe", False, "mixed case")
    check_bool_parsing("   False   ", False, "extra padding")

    empty_environment.setenv("FLASK_DEBUG", "")
    with pytest.raises(ValueError):
        create_dev_app()

def test_database_url_config(empty_db_session, empty_environment: MonkeyPatch):
    '''
    Test that setting the DATABASE_URL initializes the database 
    using the specified URL.
    '''
    empty_environment.setenv("DATABASE_URL", "sqlite:///:memory:")
    create_dev_app()
    db_engine = DataAccessLayer._engine
    assert db_engine is not None
    assert db_engine.url.database == ":memory:"

def test_root_url_required(empty_environment: MonkeyPatch):
    with pytest.raises(ValueError, match="ROOT_URL"):
        create_app(DevelopmentHUUConfig(
            ROOT_URL=""
        ))

    with pytest.raises(ValueError, match="ROOT_URL"):
        create_app(DevelopmentHUUConfig(
            ROOT_URL=None
        ))

    empty_environment.setenv("ROOT_URL", "")
    with pytest.raises(ValueError, match="ROOT_URL"):
        create_app(DevelopmentHUUConfig())

def test_prod_app_disables_development(empty_db_session, fake_prod_env: MonkeyPatch):
    def check_development_disabled(enable_testing: bool, enable_debug: bool):
        fake_prod_env.setenv("FLASK_DEBUG", str(enable_debug))
        fake_prod_env.setenv("TESTING", str(enable_testing))
        if enable_debug or enable_testing:
            with pytest.raises(ValueError):
                create_prod_app()
        else:
            create_prod_app()
    
    check_development_disabled(True, True)
    check_development_disabled(True, False)
    check_development_disabled(False, True)
    check_development_disabled(False, False)

def test_prod_secret_key_requirements(empty_db_session, fake_prod_env: MonkeyPatch): 
    def check_insecure_secret(secret: str):
        fake_prod_env.setenv("SECRET_KEY", secret)
        with pytest.raises(ValueError):
            create_prod_app()
    def check_secure_secret(secret: str):
        fake_prod_env.setenv("SECRET_KEY", secret)
        create_prod_app()

    check_insecure_secret("hi")
    check_insecure_secret("")
    check_insecure_secret("aaaaaaaaaaaaaaaaaaaaaaaaaa")
    check_insecure_secret("asdfasdfasdfasdfasdfasdfa")
    check_insecure_secret("12312132132132132132132132")
    check_insecure_secret("123456789asdfqwe")
    check_insecure_secret("123456789ASDFQWERTG")

    check_secure_secret("3-nTeYX6Zi2T6XlvN2m93cNdDHSB6NC0")
    check_secure_secret("QiWYHC1St0pPOEXY1ChiwKrYLJQr9yWH")
    check_secure_secret("wd-4FBhuf2TYP4T6FrAxaCvRLItXlIK5")
    check_secure_secret("omMTDTPUXTcizyka2AtOg570XqWFlFfP")
    check_secure_secret("iEIGSrC6jSh6QdLNib0io8sz_60lZ_BE")