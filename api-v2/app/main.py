from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.modules.router import api_router
import app.core.db as db
import app.core.config as config


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = config.get_settings()
    engine = db.db_engine(settings)
    import seed
    db.init_db(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix="/api")
