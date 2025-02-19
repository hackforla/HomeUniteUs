import time
from fastapi import FastAPI, Request
from contextlib import asynccontextmanager

from .health import health_router
from app.modules.router import api_router
import app.core.db as db
import app.core.config as config
from app.core.logging import setup_logging
from loguru import logger
import uuid 


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = config.get_settings()
    setup_logging(settings)

    logger.info("Starting application", extra={"environment": settings.HUU_ENVIRONMENT})
    engine = db.db_engine(settings)
    import app.seed
    db.init_db(engine)
    
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown")


app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    
    logger.info(f"Request ID: {request_id} - {request.method} {request.url.path}")
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    formatted_process_time = f"{process_time:.4f}s"
    
    logger.info(
        f"Request ID: {request_id} - Completed {request.method} {request.url.path} "
        f"Status Code: {response.status_code} Process Time: {formatted_process_time}"
    )
    
    response.headers["X-Request-ID"] = request_id
    return response


app.include_router(api_router, prefix="/api")
app.include_router(health_router, prefix="/api/health", tags=["health"])
