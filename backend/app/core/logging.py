import logging
from .config import Settings

logger = logging.getLogger(__name__)

def setup_logging(settings: Settings):
    if settings.HUU_ENVIRONMENT in ["development", "qa"]:
        log_level = logging.DEBUG
    else: 
        log_level = logging.INFO

    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    

    logger.debug(f"Logging setup complete for environment: {settings.HUU_ENVIRONMENT}")