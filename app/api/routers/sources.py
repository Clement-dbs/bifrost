from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.config.models import ApiSource
from pydantic import BaseModel
from app.config.database import get_db


class SourceCreate(BaseModel):
    name: str
    url: str
    auth_type: Optional[str] = "none"
    auth_value: Optional[str] = None
    response_format: Optional[str] = "json"


router = APIRouter()


@router.post("/form")
def create(body: SourceCreate, db: Session = Depends(get_db)):
    source = ApiSource(**body.model_dump())
    db.add(source)
    db.commit()
    db.refresh(source)
    return {"code": 200, "result": source}
