# 🐳 Docker Deployment Guide

Complete guide to running the User Management System with Docker.

---

## 📋 **Prerequisites**

### Check if Docker is installed:
```bash
docker --version
docker compose version
```

### Install Docker (if needed):
- **Ubuntu/Debian:**
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  # Log out and log back in
  ```

- **Mac/Windows:** Download from https://www.docker.com/products/docker-desktop

---

## 🚀 **Quick Start**

### **1. Configure Environment (First Time Only)**

```bash
cd /home/nguyen/code/fpt_practice/week_1

# Check .env file exists (already configured)
cat .env

# Optional: Customize email settings if needed
nano .env
```

The `.env` file contains:
- Database credentials
- JWT secret key
- Email/SMTP configuration
- API URLs

**Important:** Never commit `.env` to git! Use `.env.example` for documentation.

### **2. Build and Run Everything**

```bash
# Build and start all services in detached mode
docker compose up --build -d

# Or run in foreground to see logs
docker compose up --build
```

**What this does:**
- ✅ Builds backend Docker image (Python 3.13)
- ✅ Builds frontend Docker image (Node 22 + Nginx)
- ✅ Pulls PostgreSQL 15-alpine image
- ✅ Creates app-network for services
- ✅ Starts all containers with health checks
- ✅ Persists database data in volume

### **3. Access the Application**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health
- **Database:** localhost:5434 (Note: Changed from default 5432)

### **4. Stop Everything**

```bash
# Stop services (keeps data)
docker compose down

# Stop and remove data (⚠️ deletes database!)
docker compose down -v
```

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────┐
│          Docker Network (app-network)       │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Frontend │  │ Backend  │  │ Database │ │
│  │  Nginx   │  │  FastAPI │  │PostgreSQL│ │
│  │ Port 80  │  │ Port 8000│  │ Port 5432│ │
│  └──────────┘  └──────────┘  └──────────┘ │
│       ↓              ↓              ↓      │
└───────┼──────────────┼──────────────┼──────┘
     3000:80        8000:8000      5434:5432
        │              │              │
    Browser         API Calls     Database
```

---

## 📦 **Services**

### **1. Database (PostgreSQL)**
- **Image:** postgres:15-alpine
- **Internal Port:** 5432
- **External Port:** 5434 (to avoid conflict with local PostgreSQL)
- **Volume:** postgres_data (persists data)
- **Credentials:** From .env file (default: postgres/postgres)
- **Healthcheck:** `pg_isready` monitors database readiness
- **Database Name:** user_management

### **2. Backend (FastAPI)**
- **Build:** From ./user_management/backend/Dockerfile
- **Base Image:** python:3.13-slim
- **Port:** 8000:8000
- **User:** Non-root user (uid: 1000)
- **Dependencies:** Installed from requirements.txt
- **Features:**
  - JWT authentication (configurable via .env)
  - Email sending via SMTP (Gmail support)
  - PostgreSQL database connection
  - Hot reload enabled for development
  - Health check endpoint: /health
- **Environment:** Configured via .env file

### **3. Frontend (React + Vite + Nginx)**
- **Build:** Multi-stage Dockerfile
  - Stage 1: Node 22-alpine (builds React app with Vite)
  - Stage 2: Nginx 1.27-alpine (serves static files)
- **Port:** 3000:80 (host:container)
- **Features:**
  - Production-optimized build
  - Gzip compression enabled
  - SPA routing support
  - Security headers (X-Frame-Options, X-XSS-Protection, etc.)
  - Cache control for assets
  - Small image size (~50MB)

---

## 🔧 **Docker Commands Reference**

### **Start Services**

```bash
# Build and start in foreground (see logs)
docker compose up --build

# Start in background (detached mode)
docker compose up -d --build

# Start without rebuilding
docker compose up -d

# Start specific service
docker compose up backend
```

### **Stop Services**

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database!)
docker compose down -v

# Stop specific service
docker compose stop backend
```

### **View Logs**

```bash
# All services
docker compose logs

# Follow logs (live updates)
docker compose logs -f

# Specific service
docker compose logs backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### **Rebuild Services**

```bash
# Rebuild all
docker compose build

# Rebuild specific service
docker compose build backend

# Force rebuild (no cache)
docker compose build --no-cache
```

### **Check Status**

```bash
# List running containers
docker compose ps

# Check service health
docker compose ps
docker inspect user_mgmt_db | grep Status
```

### **Execute Commands in Containers**

```bash
# Access backend shell
docker compose exec backend bash

# Access database
docker compose exec db psql -U postgres -d user_management

# Run migrations
docker compose exec backend python -m app.migrations

# Check Python version
docker compose exec backend python --version
```

---

## 🔍 **Testing the Docker Setup**

### **Test 1: Check All Services Running**

```bash
docker compose ps
```

**Expected output:**
```
NAME                  STATUS                  PORTS
user_mgmt_db          Up (healthy)           0.0.0.0:5434->5432/tcp
user_mgmt_backend     Up (healthy)           0.0.0.0:8000->8000/tcp
user_mgmt_frontend    Up (health: starting)  0.0.0.0:3000->80/tcp
```

Note: All services have health checks. Wait a few seconds for them to become healthy.

### **Test 2: Check Backend Health**

```bash
# Health check endpoint
curl http://localhost:8000/health
```

**Expected:** `{"status":"healthy"}`

```bash
# Legacy ping endpoint also works
curl http://localhost:8000/ping
```

**Expected:** `{"status":"ok"}`

### **Test 3: Check Frontend**

```bash
curl -I http://localhost:3000
```

**Expected:** `HTTP/1.1 200 OK` with HTML content

```bash
# Or get the full HTML
curl http://localhost:3000
```

### **Test 4: Check Database**

```bash
# Connect to database
docker compose exec db psql -U postgres -d user_management -c "\dt"
```

**Expected:** List of tables (users, email_templates, email_logs)

```bash
# Check database connection from host
psql -h localhost -p 5434 -U postgres -d user_management -c "SELECT version();"
# Password: postgres (from .env)

### **Test 5: Full Application Test**

1. **Open browser:** http://localhost:3000
2. **Register user:**
   - Username: testuser
   - Email: test@example.com
   - Password: test123
3. **Login** with credentials
4. **View Dashboard** - See registered users
5. **Go to Templates** tab
6. **Create email template**
7. **Test send email**
8. **Check logs:**
   ```bash
   docker compose logs backend | grep "Email"
   ```

---

## 🐛 **Troubleshooting**

### **Problem 1: Port Already in Use**

**Error:** `port is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :3000   # Frontend
lsof -i :8000   # Backend
lsof -i :5434   # Database (changed from default 5432)

# Kill the process
lsof -ti:8000 | xargs kill -9

# Or change ports in docker-compose.yml:
# ports:
#   - "3001:80"    # Use different host port
```

**Why port 5434?** Port 5432 is often used by local PostgreSQL. We use 5434 to avoid conflicts.

### **Problem 2: Database Connection Failed**

**Error:** `could not connect to server`

**Solution:**
```bash
# Check database health
docker compose ps db

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

### **Problem 3: Frontend Can't Connect to Backend**

**Error:** Network error in browser console

**Solution:**
1. Check backend is running: `docker compose ps backend`
2. Check backend logs: `docker compose logs backend`
3. Verify API URL in frontend build
4. Rebuild frontend: `docker compose build frontend`

### **Problem 4: Email Not Sending**

**Error:** `SMTP authentication failed`

**Solution:**
1. Check email credentials in docker-compose.yml
2. Verify `EMAIL_DEVELOPMENT_MODE=false`
3. Test with development mode first

### **Problem 5: Build Fails**

**Error:** Various build errors

**Solution:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache

# Check disk space
docker system df
```

### **Problem 6: Containers Keep Restarting**

**Solution:**
```bash
# Check logs for errors
docker compose logs

# Check specific service
docker compose logs backend

# Remove restart policy temporarily
# Edit docker-compose.yml: comment out 'restart: unless-stopped'
```

---

## 📊 **Environment Variables**

All configuration is managed through the `.env` file. Docker Compose automatically loads it.

### **Current .env Configuration**

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=user_management
DATABASE_URL=postgresql://postgres:postgres@db:5432/user_management

# JWT Authentication
SECRET_KEY=supersecretkey123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration
EMAIL_DEVELOPMENT_MODE=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your.email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your.email@gmail.com
SMTP_FROM_NAME=User Management System

# API Configuration (for frontend)
VITE_API_URL=http://localhost:8000
```

### **How to Update:**

**Edit .env file:**
```bash
nano .env
# Make your changes
docker compose down
docker compose up --build -d
```

**Important Notes:**
- ✅ `.env` is already configured and gitignored
- ✅ Use `.env.example` as a template for new setups
- ⚠️ Never commit `.env` with real secrets to git
- ⚠️ Change `SECRET_KEY` in production!
- ⚠️ Use strong passwords for `POSTGRES_PASSWORD`

### **Email Setup:**

**For Gmail:**
1. Enable 2-factor authentication
2. Create app password: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```env
   SMTP_USERNAME=your.email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   ```

**For Development (Mock Emails):**
```env
EMAIL_DEVELOPMENT_MODE=true
```

---

## 🔄 **Development vs Production**

### **Development Mode**
```yaml
# docker-compose.yml
volumes:
  - ./user_management/backend:/app  # Hot reload
environment:
  EMAIL_DEVELOPMENT_MODE: "true"    # Mock emails
```

### **Production Mode**
```yaml
# docker-compose.yml
# Remove volumes (no hot reload)
environment:
  EMAIL_DEVELOPMENT_MODE: "false"   # Real emails
  DATABASE_URL: postgresql://user:pass@production-db/dbname
```

---

## 🧹 **Cleanup**

### **Remove Everything**

```bash
# Stop and remove containers, networks
docker compose down

# Also remove volumes (⚠️ DELETES DATA)
docker compose down -v

# Clean up unused Docker resources
docker system prune -a
```

### **Selective Cleanup**

```bash
# Remove only containers
docker compose rm

# Remove specific service
docker compose rm backend

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

---

## 📈 **Performance Optimization**

### **1. Multi-Stage Builds**
Frontend uses multi-stage build:
- Build stage: Node.js compiles React
- Production stage: Nginx serves static files
- Result: Small image size (~50MB vs 1GB+)

### **2. Layer Caching**
Dockerfiles optimized for layer caching:
- Dependencies installed first (changes rarely)
- Code copied last (changes frequently)
- Faster rebuilds!

### **3. Health Checks**
Database has health check:
- Backend waits for DB to be ready
- No connection errors on startup

### **4. Resource Limits**
Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## 🔐 **Security Best Practices**

### **Implemented Security Features:**

1. ✅ **Environment-based secrets**
   - All secrets in `.env` file (gitignored)
   - `.env.example` for documentation
   - No hardcoded credentials in docker-compose.yml

2. ✅ **Specific image versions**
   - `postgres:15-alpine` (not latest)
   - `python:3.13-slim` (specific version)
   - `node:22-alpine` (stable version)
   - `nginx:1.27-alpine` (specific version)

3. ✅ **Non-root user execution**
   - Backend runs as `appuser` (uid: 1000)
   - No root privileges for application processes
   - Configured in Dockerfiles

4. ✅ **Docker security files**
   - `.dockerignore` excludes sensitive files
   - Prevents copying .env, credentials, etc. into images

5. ✅ **Layer optimization**
   - Dependencies cached separately from code
   - Faster rebuilds, smaller attack surface

6. ✅ **Health checks**
   - Database health monitoring
   - Backend health endpoint
   - Frontend availability check
   - Automatic restart on failure

### **Production Recommendations:**

```bash
# 1. Change default credentials
POSTGRES_PASSWORD=<strong-random-password>
SECRET_KEY=<256-bit-random-key>

# 2. Use secrets management
docker secret create db_password password.txt

# 3. Enable read-only root filesystem
read_only: true
tmpfs:
  - /tmp

# 4. Limit resources
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M

# 5. Keep images updated
docker compose pull
docker compose up -d
```

---

## 📝 **Useful Scripts**

### **Create helper scripts:**

**start.sh**
```bash
#!/bin/bash
docker compose up -d --build
echo "✅ All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000/docs"
```

**stop.sh**
```bash
#!/bin/bash
docker compose down
echo "✅ All services stopped!"
```

**logs.sh**
```bash
#!/bin/bash
docker compose logs -f --tail=100
```

**Make executable:**
```bash
chmod +x start.sh stop.sh logs.sh
```

---

## 🎯 **Summary**

### **Quick Commands:**
```bash
# Start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild specific service
docker compose build backend --no-cache

# Full cleanup (⚠️ deletes data!)
docker compose down -v && docker system prune -a
```

### **Access URLs:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health
- **Database:** localhost:5434

### **Default Credentials:**
- **Database:** postgres / postgres (from .env)
- **User Account:** Create via registration at http://localhost:3000/register

### **Configuration Files:**
- **docker-compose.yml** - Service orchestration
- **.env** - Environment variables and secrets
- **Dockerfile (backend)** - Backend image build
- **Dockerfile (frontend)** - Frontend image build
- **requirements.txt** - Python dependencies
- **package.json** - Node dependencies

---

## 🚀 **Next Steps**

1. ✅ Test locally with Docker
2. ✅ Verify all features work
3. ✅ Deploy to cloud (AWS, GCP, Azure)
4. ✅ Setup CI/CD (GitHub Actions, GitLab CI)
5. ✅ Add monitoring (Prometheus, Grafana)
6. ✅ Setup backups for database

---

**🎉 Your application is now fully containerized and production-ready!**
