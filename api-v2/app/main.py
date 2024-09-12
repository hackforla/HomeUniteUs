from fastapi import FastAPI
from contextlib import asynccontextmanager


from app.modules.router import api_router
# from core.config import settings
from app.seed import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(api_router, prefix="/api")
