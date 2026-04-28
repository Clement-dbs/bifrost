from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sources = relationship("ApiSource", back_populates="owner", cascade="all, delete")


class ApiSource(Base):
    __tablename__ = "api_sources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    auth_type = Column(String, default="none") 
    auth_value = Column(String, nullable=True)   
    extra_headers = Column(JSON, nullable=True)
    response_format = Column(String, default="json")
    is_active = Column(Boolean, default=True)
    status = Column(String, default="active")    
    last_error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="sources")
    schedule = relationship("Schedule", back_populates="source", uselist=False, cascade="all, delete")
    collections = relationship("Collection", back_populates="source", cascade="all, delete")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("api_sources.id", ondelete="CASCADE"), nullable=False, unique=True)
    frequency = Column(String, nullable=False)  
    storage_dest = Column(String, default="csv") 
    is_active = Column(Boolean, default=True)
    fail_count = Column(Integer, default=0)
    fail_threshold = Column(Integer, default=3)
    fail_action = Column(String, default="email") 
    next_run = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    source = relationship("ApiSource", back_populates="schedule")


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("api_sources.id", ondelete="CASCADE"), nullable=False)
    payload = Column(JSON, nullable=True)
    status = Column(String, default="ok")        
    error_message = Column(Text, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    collected_at = Column(DateTime(timezone=True), server_default=func.now())

    source = relationship("ApiSource", back_populates="collections")