from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Email Template Schemas
class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    body_html: str

class EmailTemplateResponse(EmailTemplateCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Email Sending Schemas
class TestEmailRequest(BaseModel):
    template_id: int
    to_email: EmailStr
    variables: Optional[dict] = {}

class EmailSendResponse(BaseModel):
    status: str
    message: str

# Email Log Schemas
class EmailLogResponse(BaseModel):
    id: int
    to_email: str
    subject: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True