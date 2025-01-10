from backend.app.modules.deps import SettingsDep
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse

health_router = APIRouter()


@health_router.get("/", status_code=status.HTTP_200_OK)
def health():
    return "UP"

@health_router.get("/nginx-logs", status_code=status.HTTP_200_OK)
def nginx_logs(settings: SettingsDep):

    if not settings.HUU_ENVIRONMENT:
        raise HTTPException(
            status_code=400,
            detail=f'Not an nginx environment'
        )

    nginx_logs_dir = f'/var/log/{settings.HUU_ENVIRONMENT}.homeunite.us'

    with open(f'{nginx_logs_dir}/nginx-access.log') as f:
        access_logs = f.read()
    
    with open('{nginx_logs_dir}/nginx-error.log') as f:
        error_logs = f.read()

    return JSONResponse(content={
        'accessLogs': access_logs,
        'errorLogs': error_logs
    })

    
    

