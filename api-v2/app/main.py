from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager

from app.modules.router import api_router
import app.core.db as db
import app.core.config as config
import app.modules.deps as deps


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = config.get_settings()
    engine = db.db_engine(settings)
    # TODO: rewrite this import statement
    import app.seed
    db.init_db(engine)

    yield


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Home Unite Us API",
        version="0.1.0",
        summary="OpenAPI schema for the Home Unite Us API.",
        description=
        "This OpenAPI schema documents the operations that can be performed against the Home Unite Us API.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app = FastAPI(lifespan=lifespan)
app.openapi = custom_openapi

app.include_router(api_router, prefix="/api")
