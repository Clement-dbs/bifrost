from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SourceCreate(BaseModel):
    name: str
    url: str
    auth_type: str = "none"
    auth_value: Optional[str] = None
    extra_headers: Optional[dict] = None
    response_format: str = "json"

class SourceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    auth_type: Optional[str] = None
    auth_value: Optional[str] = None
    extra_headers: Optional[dict] = None
    response_format: Optional[str] = None
    is_active: Optional[bool] = None

class SourceOut(BaseModel):
    id: int
    name: str
    url: str
    auth_type: str
    response_format: str
    is_active: bool
    status: str
    last_error: Optional[str]
    created_at: datetime
    model_config = {"from_attributes": True}

class ScheduleCreate(BaseModel):
    source_id: int
    frequency: str
    storage_dest: str = "csv"
    fail_threshold: int = 3
    fail_action: str = "email"

class ScheduleOut(BaseModel):
    id: int
    source_id: int
    frequency: str
    storage_dest: str
    is_active: bool
    fail_count: int
    next_run: Optional[datetime]
    created_at: datetime
    model_config = {"from_attributes": True}

class CollectionOut(BaseModel):
    id: int
    source_id: int
    status: str
    error_message: Optional[str]
    response_time_ms: Optional[int]
    collected_at: datetime
    model_config = {"from_attributes": True}

class DashboardStats(BaseModel):
    active_sources: int
    total_sources: int
    collections_today: int
    collections_yesterday: int
    success_rate: float
    error_count: int