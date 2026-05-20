from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Connector(Base):
    """
    Représente une API externe configurée par l'utilisateur.
    Contient tout ce qu'il faut pour construire et authentifier la requête.
    """
    __tablename__ = "connectors"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String,  nullable=False, unique=True)
    url             = Column(String,  nullable=False)
    method          = Column(String,  nullable=False, default="GET")
    auth            = Column(JSON,    nullable=False, default={"type": "none"})
    params          = Column(JSON,    nullable=True)  
    headers         = Column(JSON,    nullable=True)   
    body            = Column(JSON,    nullable=True)   
    response_format = Column(String,  nullable=False, default="JSON") 
    is_active       = Column(Boolean, default=True)
    status          = Column(String,  default="active")
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

