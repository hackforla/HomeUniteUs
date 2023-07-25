# Third Party
import pytest

# Local
from configs.configs import Config, compile_config

class TestConfigs:

    def test_base_config(self):
        EXPECTED_NUM_CONFIGS = 4

        configs = Config()
        config_variables = [ attr for attr in dir(configs) if not callable(getattr(configs, attr)) and not attr.startswith("__") ]

        assert EXPECTED_NUM_CONFIGS == len(config_variables)
        assert configs.HOST == 'localhost'
        assert configs.PORT == 8080
        assert configs.DEBUG == True
        assert configs.USE_RELOADER == True

    def test_compile_config_no_personal(self):
        with pytest.raises(ModuleNotFoundError):
            _compile_config('personal', 'configs.doesnt_exist', 'PersonalConfigExample')
        
    def test_compile_config_some_personal(self):
        configs = _compile_config('personal', 'configs.personal_config_example', 'PersonalConfigExample')

        assert configs.HOST == 'localhost'
        assert configs.PORT == 8081
        assert configs.DEBUG == False
        assert configs.USE_RELOADER == False

