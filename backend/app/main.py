from fastapi import FastAPI
from contextlib import asynccontextmanager

from .health import health_router
from app.modules.router import api_router
import app.core.db as db
import app.core.config as config
from app.core.logging import setup_logging
import logging 


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = config.get_settings()
    setup_logging(settings)

    logger = logging.getLogger(__name__)
    logger.info("Starting application", extra={"environment": settings.HUU_ENVIRONMENT})
    engine = db.db_engine(settings)
    import app.seed
    db.init_db(engine)
    
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown")


app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix="/api")
app.include_router(health_router, prefix="/api/health", tags=["health"])
