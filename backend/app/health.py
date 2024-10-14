from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

health_router = APIRouter()


@health_router.get("/", status_code=status.HTTP_200_OK)
def health():
    return "UP"

@health_router.get("/nginx-logs", status_code=status.HTTP_200_OK)
def nginx_logs():
    with open('/var/log/qa.homeunite.us/nginx-access.log') as f:
        access_logs = f.read()
    
    with open('/var/log/qa.homeunite.us/nginx-error.log') as f:
        error_logs = f.read()

    return JSONResponse(content={
        'accessLogs': access_logs,
        'errorLogs': error_logs
    })

    
    

