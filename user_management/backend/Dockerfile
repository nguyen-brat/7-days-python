FROM python:3.13-slim

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy backend application
COPY . .

# Install dependencies directly
RUN pip install --no-cache-dir \
    fastapi>=0.121.3 \
    python-jose[cryptography]>=3.3.0 \
    passlib[bcrypt]>=1.7.4 \
    bcrypt==4.0.1 \
    psycopg2-binary>=2.9.11 \
    python-dotenv>=1.2.1 \
    sqlalchemy>=2.0.44 \
    uvicorn>=0.38.0 \
    pydantic[email]>=2.0.0 \
    python-multipart>=0.0.9 \
    aiosmtplib>=3.0.0 \
    jinja2>=3.1.0

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]