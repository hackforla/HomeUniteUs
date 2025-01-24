
import logging
from pythonjsonlogger import jsonlogger
from .config import Settings

logger = logging.getLogger(__name__)

def setup_logging(settings: Settings):
    if settings.HUU_ENVIRONMENT in ["development", "qa"]:
        log_level = logging.DEBUG
    else:
        """
        log only on error in production to reduce logging costs.
        uncomment second line and remove first if info logging is 
        needed. 
        """
        log_level = logging.ERROR
        # log_level = logging.INFO

    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s',
        json_indent=None 
    )

    # handler to send to console output (stdout)
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    # when sending logs to console, make them json formatted
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.addHandler(handler)

    logger.debug(f"Logging setup complete for environment: {settings.HUU_ENVIRONMENT}")