from fastapi import APIRouter, status

health_router = APIRouter()


@health_router.get("/", status_code=status.HTTP_200_OK)
def health():
    return "UP"
