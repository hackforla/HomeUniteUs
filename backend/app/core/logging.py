import logging
from .config import Settings

logger = logging.getLogger(__name__)

def setup_logging(settings: Settings):
    # Set log level based on environment
    if settings.HUU_ENVIRONMENT in ["development", "qa"]:
        log_level = logging.DEBUG
    else:  # production
        log_level = logging.INFO

    # Configure logging
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    logger.debug(f"Logging setup complete for environment: {settings.HUU_ENVIRONMENT}")