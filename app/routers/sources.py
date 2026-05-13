from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.models import ApiSource
from app.config.shemas import SourceIn, SourceOut
from app.config.database import get_db


router = APIRouter()


@router.post("/", response_model=SourceOut, status_code=201)
def create(body: SourceIn, db: Session = Depends(get_db)):
    source = ApiSource(**body.model_dump())
    db.add(source)
    db.commit()
    db.refresh(source)
    return source


@router.delete("/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(ApiSource).filter(ApiSource.id == source_id).first()
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source {source_id} not found.",
        )
    db.delete(source)
    db.commit()


@router.get("/", status_code=status.HTTP_200_OK)
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(ApiSource).all()
    return sources
