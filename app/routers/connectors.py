from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Connector
from app.schemas.schemas import ConnectorCreate, ConnectorRead
from app.services.executor import Executor


router = APIRouter()


@router.get("/", response_model=list[ConnectorRead])
def list_connectors(db: Session = Depends(get_db)):
    return db.query(Connector).all()


@router.get("/{connector_id}", response_model=ConnectorRead)
def get_connector(connector_id: int, db: Session = Depends(get_db)):
    connector = db.query(Connector).filter(Connector.id == connector_id).first()
    if not connector:
        raise HTTPException(status_code=404, detail=f"Connector {connector_id} not found.")
    return connector


@router.post("/", response_model=ConnectorRead, status_code=201)
def create_connector(body: ConnectorCreate, db: Session = Depends(get_db)):
    try:
        Executor.test(body)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    connector = Connector(**body.model_dump())
    db.add(connector)
    db.commit()
    db.refresh(connector)
    return connector


@router.patch("/{connector_id}", response_model=ConnectorRead)
def update_connector(connector_id: int, body: ConnectorCreate, db: Session = Depends(get_db)):
    connector = db.query(Connector).filter(Connector.id == connector_id).first()
    if not connector:
        raise HTTPException(status_code=404, detail=f"Connector {connector_id} not found.")

    try:
        Executor.test(body)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    for field, value in body.model_dump().items():
        setattr(connector, field, value)

    db.commit()
    db.refresh(connector)
    return connector


@router.delete("/{connector_id}", status_code=204)
def delete_connector(connector_id: int, db: Session = Depends(get_db)):
    connector = db.query(Connector).filter(Connector.id == connector_id).first()
    if not connector:
        raise HTTPException(status_code=404, detail=f"Connector {connector_id} not found.")
    db.delete(connector)
    db.commit()
