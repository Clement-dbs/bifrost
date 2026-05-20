from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, HttpUrl, model_validator, field_validator
from datetime import datetime
from .auth import Auth, AuthNone


class ConnectorCreate(BaseModel):
    """Payload envoyé par le front pour créer ou modifier un Connector."""

    name: str = Field(min_length=1, max_length=30)
    url: HttpUrl
    method:Literal["GET", "POST", "PUT", "PATCH", "DELETE"] = "GET"
    auth: Auth = Field(default=AuthNone())
    params:Optional[Dict[str, str]]  = None
    headers: Optional[Dict[str, str]]  = None
    body: Optional[Dict[str, Any]]   = None
    response_format: Literal["JSON"] = "JSON"

    @model_validator(mode="after")
    def validate_body(self):
        if self.body and self.method not in ("POST", "PUT", "PATCH"):
            raise ValueError("body is only allowed with POST, PUT, PATCH methods.")
        return self
    
    @field_validator("url", mode="after")
    @classmethod
    def url_to_str(cls, v):
        return str(v)


class ConnectorRead(ConnectorCreate):
    """Représentation complète d'un Connector renvoyée au front."""

    id:        int
    is_active: bool
    status:    Literal["active", "error", "paused"]
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
