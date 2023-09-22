import pytest
from .app_config import DebugTestConfig, ReleaseTestConfig

def pytest_addoption(parser: pytest.Parser) -> None:
    '''
    pytest hook used to register argparse-style options and ini-style config values, 
    called once at the beginning of a test run.
    '''    
    parser.addoption(
        "--mode",
        action="store",
        default="debug",
        help="run tests in debug or release mode",
    )

def pytest_configure(config: pytest.Config) -> None:
    '''
    pytest hook used to perform initial test application configuration, 
    called at the beginning of a test run, within conftest.py file.
    '''
    mode = config.getoption("mode", default='debug').lower()
    if mode == 'debug':
        # All application configurations are defined explicitly in code. The 
        # system environment is not used. All resources that can be safely 
        # mocked, will be mocked (e.g. mock AWS cognito API calls)
        app_config = DebugTestConfig()
    elif mode == 'release':
        # Load configuration from the environment, to allow the use of 
        # secrets, and disable the mocking of any resources 
        from dotenv import load_dotenv, find_dotenv
        dot_env = find_dotenv()
        if dot_env:
            load_dotenv(dot_env)
        app_config = ReleaseTestConfig()
    else:
        raise KeyError(f"pytest application configuration mode {mode} not"
                   "recognized. Only debug and release modes supported.")
    
    config.app_config = app_config

@pytest.fixture(scope='class')
def pass_app_config(request):
    '''
    Attach the pytest configuration to the decorated class as a field. 
    This fixutre is needed to pass pytest configurations to 
    unittest.TestCase classes.
    '''
    setattr(request.cls, 'app_config', request.config.app_config)