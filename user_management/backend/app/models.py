from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from .databases import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EmailTemplate(Base):
    __tablename__ = "email_templates"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    subject = Column(String(250))
    body_html = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EmailLog(Base):
    __tablename__ = "email_logs"
    id = Column(Integer, primary_key=True)
    to_email = Column(String(200))
    subject = Column(String(250))
    body = Column(Text)
    status = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())