import jwt

from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session


from schemas import User
from crud import get_user
from api.deps import get_db   


router = APIRouter()


'''
# Get user route

This route is used to get the current user info
'''

@router.get("/", response_model=User)
def get_user_info(request: Request, db: Session = Depends(get_db)):
    id_token = request.cookies.get('id_token')
    if(id_token is None):
        raise HTTPException(status_code=401, detail="Missing id token")
    
    decoded = jwt.decode(id_token, algorithms=["RS256"], options={"verify_signature": False})
    email = decoded['email']
    if(email is None):
        raise HTTPException(status_code=401, detail="Email not found in token")

    user = get_user(db, email)
        
    return user