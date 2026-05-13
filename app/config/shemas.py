from typing import Optional, Literal
from pydantic import BaseModel, Field, HttpUrl, model_validator, field_validator
from datetime import datetime


class SourceIn(BaseModel):
    name: str = Field(min_length=1, max_length=25)
    url: HttpUrl
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"] = "GET"
    auth_type: Literal["none", "api_key", "bearer", "basic", "oauth2"] = "none"
    auth_value: Optional[str] = Field(default=None, max_length=512)
    response_format: Literal["json", "csv", "xml", "text"] = "json"

    @field_validator("url", mode="after")
    @classmethod
    def url_to_str(cls, v):
        return str(v)

    @model_validator(mode="after")
    def auth_value_required_if_not_none(self):
        if self.auth_type != "none" and not self.auth_value:
            raise ValueError("auth_value is required when auth_type is not 'none'.")
        return self


class SourceOut(SourceIn):
    id: int
    is_active: bool
    status: Literal["active", "error", "paused"]
    last_error: Optional[str]
    created_at: datetime
