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

### **1. Build and Run Everything**

```bash
cd /home/nguyen/code/fpt_practice/week_1

# Build and start all services
docker compose up --build
```

**What this does:**
- ✅ Builds backend Docker image
- ✅ Builds frontend Docker image
- ✅ Pulls PostgreSQL image
- ✅ Creates network for services
- ✅ Starts all containers
- ✅ Shows logs in terminal

### **2. Access the Application**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Database:** localhost:5432

### **3. Stop Everything**

```bash
# Press Ctrl+C in the terminal

# Or in another terminal:
docker compose down
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
     3000:80        8000:8000      5432:5432
        │              │              │
    Browser         API Calls     Database
```

---

## 📦 **Services**

### **1. Database (PostgreSQL)**
- **Image:** postgres:15-alpine
- **Port:** 5432:5432
- **Volume:** postgres_data (persists data)
- **Healthcheck:** Monitors database readiness

### **2. Backend (FastAPI)**
- **Build:** From ./user_management/backend/Dockerfile
- **Port:** 8000:8000
- **Dependencies:** All Python packages (fastapi, sqlalchemy, etc.)
- **Features:**
  - JWT authentication
  - Email sending (Gmail SMTP)
  - Database connection
  - Hot reload enabled

### **3. Frontend (React + Nginx)**
- **Build:** Multi-stage Dockerfile
  - Stage 1: Node 22 (build React app)
  - Stage 2: Nginx (serve static files)
- **Port:** 3000:80
- **Features:**
  - Production-optimized build
  - Gzip compression
  - SPA routing
  - Security headers

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
NAME                  STATUS    PORTS
user_mgmt_db          Up        0.0.0.0:5432->5432/tcp
user_mgmt_backend     Up        0.0.0.0:8000->8000/tcp
user_mgmt_frontend    Up        0.0.0.0:3000->80/tcp
```

### **Test 2: Check Backend Health**

```bash
curl http://localhost:8000/ping
```

**Expected:** `{"status":"ok"}`

### **Test 3: Check Frontend**

```bash
curl -I http://localhost:3000
```

**Expected:** `200 OK` with HTML content

### **Test 4: Check Database**

```bash
docker compose exec db psql -U postgres -d user_management -c "\dt"
```

**Expected:** List of tables (users, email_templates, email_logs)

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
lsof -i :3000
lsof -i :8000
lsof -i :5432

# Kill local services or change ports in docker-compose.yml
```

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

### **Backend (.env or docker-compose.yml)**

```yaml
# Database
DATABASE_URL: postgresql://postgres:postgres@db:5432/user_management

# Authentication
SECRET_KEY: your_secret_key_here
ALGORITHM: HS256
ACCESS_TOKEN_EXPIRE_MINUTES: 30

# Email
EMAIL_DEVELOPMENT_MODE: "false"
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USERNAME: your.email@gmail.com
SMTP_PASSWORD: your_app_password
SMTP_FROM_EMAIL: your.email@gmail.com
SMTP_FROM_NAME: Your App Name
```

### **How to Update:**

**Option 1: Edit docker-compose.yml directly**
```bash
nano docker-compose.yml
# Edit environment section
docker compose up --build
```

**Option 2: Use .env file**
```bash
# Create .env.docker
DATABASE_URL=postgresql://postgres:postgres@db:5432/user_management
SECRET_KEY=newsecretkey

# Reference in docker-compose.yml
env_file:
  - .env.docker
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

1. ✅ **Don't commit secrets**
   - Use .env files
   - Add .env to .gitignore

2. ✅ **Use specific image versions**
   - ✅ `postgres:15-alpine` (good)
   - ❌ `postgres:latest` (bad)

3. ✅ **Run as non-root** (already configured in Dockerfiles)

4. ✅ **Use .dockerignore** (excludes sensitive files)

5. ✅ **Keep images updated**
   ```bash
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
# Start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild
docker compose build --no-cache

# Clean
docker compose down -v && docker system prune -a
```

### **URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### **Default Credentials:**
- Database: postgres / postgres
- Admin: (create via registration)

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
