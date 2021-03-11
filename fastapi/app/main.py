from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas

from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/hosts/", response_model=List[schemas.Host])
def read_hosts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hosts = crud.get_hosts(db, skip=skip, limit=limit)
    return hosts


@app.get("/api/hosts/{host_id}", response_model=schemas.Host)
def read_host(host_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_host(db, host_id=host_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

