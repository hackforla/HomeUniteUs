from .configs.registry import HUUConfigRegistry
from .app import create_app

if __name__ == "__main__":
    dev_config = HUUConfigRegistry.load_config(HUUConfigRegistry.DEVELOPMENT)
    create_app(dev_config).run(
        host=dev_config.HOST,
        port=dev_config.PORT,
        load_dotenv=False
    )
