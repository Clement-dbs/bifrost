from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.config.database import Base


class ApiSource(Base):
    __tablename__ = "api_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    auth_type = Column(String, default="none")
    auth_value = Column(String, nullable=True)
    response_format = Column(String, default="json")
    is_active = Column(Boolean, default=True)
    status = Column(String, default="active")
    last_error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
