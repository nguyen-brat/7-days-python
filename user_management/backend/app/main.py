from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import List
from jose import JWTError, jwt
from passlib.context import CryptContext
from . import models, schemas, databases as database
import os

# --- Day 1: Initialization ---
app = FastAPI(title="User Management System")

# CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB
models.Base.metadata.create_all(bind=database.engine)

# --- Day 3: Authentication Config ---
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Utils ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# --- Routes ---

@app.get("/ping")
def ping():
    return {"status": "ok"}

# Auth Routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users", response_model=schemas.UserResponse, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # Note: In Day 5, you would trigger the welcome email background task here
    return new_user

@app.get("/users/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# CRUD Routes (Admin/General)
@app.get("/users", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# --- Day 6: Email Templates CRUD ---
@app.get("/email-templates", response_model=List[schemas.EmailTemplateResponse])
def get_templates(db: Session = Depends(database.get_db)):
    return db.query(models.EmailTemplate).all()

@app.post("/email-templates", response_model=schemas.EmailTemplateResponse)
def create_template(template: schemas.EmailTemplateCreate, db: Session = Depends(database.get_db)):
    db_template = models.EmailTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

# --- Email Sending Endpoints ---
from .email_service import email_service

@app.post("/email/test-send", response_model=schemas.EmailSendResponse)
async def test_send_email(
    request: schemas.TestEmailRequest,
    db: Session = Depends(database.get_db)
):
    """
    Send a test email using a template with variable substitution
    (No authentication required for testing)
    """
    # Get template
    template = db.query(models.EmailTemplate).filter(
        models.EmailTemplate.id == request.template_id
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # Send email
    result = await email_service.send_template_email(
        to_email=request.to_email,
        template=template,
        variables=request.variables,
        db=db
    )

    return result

@app.get("/email/logs", response_model=List[schemas.EmailLogResponse])
def get_email_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get email send logs
    """
    logs = db.query(models.EmailLog).order_by(
        models.EmailLog.created_at.desc()
    ).offset(skip).limit(limit).all()
    return logs