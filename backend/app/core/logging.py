
import sys
from loguru import logger
import logging
from typing import Any
from .config import Settings


def setup_logging(settings: Settings):
    """
    Configure logging setup using Loguru.
    Args:
        settings: Application settings containing LOG_LEVEL and HUU_ENVIRONMENT
    """
    try:
        logger.remove()
        
        log_level = settings.LOG_LEVEL.upper()
        if log_level not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
            logger.warning(f"Invalid log level {log_level}, defaulting to INFO")
            log_level = "INFO"

        class InterceptHandler(logging.Handler):
            def emit(self, record):
                try:
                    level = logger.level(record.levelname).name
                except ValueError:
                    level = record.levelno

                frame, depth = logging.currentframe(), 2
                while frame.f_code.co_filename == logging.__file__:
                    frame = frame.f_back
                    depth += 1

                logger.opt(depth=depth, exception=record.exc_info).log(
                    level, record.getMessage()
                )

        logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
        '''
        A logging file can replace logging to standard out by changing sys.stdout to filename.log
        '''
        if settings.HUU_ENVIRONMENT.lower() in ["development", "local"]:
            logger.add(
                sys.stdout,
                format="<white>{time:YYYY-MM-DD HH:mm:ss}</white> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<green>{function}</green> - <white>{message}</white>",
                level=log_level,
                colorize=True,
                backtrace=True,
                diagnose=True
            )
        else:
            logger.add(
                sys.stdout,
                level=log_level,
                serialize=True,  
                backtrace=True,
                diagnose=False,  
                format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function} | {message}",
            )

        logger.debug(f"Logging setup complete for environment: {settings.HUU_ENVIRONMENT} with level: {log_level}")
        
    except Exception as e:
        print(f"Failed to setup logging: {str(e)}")  
        raise