# 🚀 Local Development Setup (Without Docker)

This guide will help you run the User Management System locally without Docker.

## Prerequisites

✅ **Already Installed:**
- PostgreSQL 17.5
- Python 3.13.2
- Node.js v22.21.1
- uv (Python package manager)

---

## Quick Start (3 Steps)

### **Step 1: Setup Database**

**Option A - Use Docker for DB only (Easiest):**
```bash
cd /home/nguyen/code/fpt_practice/week_1
docker-compose up db -d
```

**Option B - Use local PostgreSQL:**
```bash
# Create PostgreSQL user and database
sudo -u postgres psql << EOF
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE user_management OWNER postgres;
ALTER USER postgres WITH SUPERUSER;
EOF
```

Verify database is running:
```bash
pg_isready
```

---

### **Step 2: Run Backend**

Open a new terminal:

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-backend.sh
```

The backend will be available at:
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

### **Step 3: Run Frontend**

Open another terminal:

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-frontend.sh
```

The frontend will be available at:
- **App:** http://localhost:5173

---

## Manual Setup (If scripts don't work)

### Backend (Terminal 1)

```bash
cd /home/nguyen/code/fpt_practice/week_1

# Load environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_management"
export SECRET_KEY="supersecretkey123"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

# Install dependencies
uv sync

# Run server
cd user_management/backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Terminal 2)

```bash
cd /home/nguyen/code/fpt_practice/week_1/user_management/frontend

# Install dependencies (if needed)
npm install

# Run dev server
npm run dev
```

---

## Testing the Application

1. **Open Browser:** http://localhost:5173
2. **Register a User:**
   - Click "Register"
   - Fill in username, email, password
   - Submit
3. **Login:**
   - Use your credentials
   - You'll be redirected to Dashboard
4. **Check Dashboard:**
   - View all registered users
5. **Test Email Templates:**
   - Click "Templates" in navbar
   - Create a new template
   - See live preview

---

## Troubleshooting

### Database Connection Issues

**Error:** `connection to server failed: FATAL: Peer authentication failed`

**Solution:** Use Docker for database:
```bash
docker-compose up db -d
```

### Backend Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

### Frontend Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill it
kill -9 <PID>
```

### Python Dependencies Issues

```bash
# Clear cache and reinstall
cd /home/nguyen/code/fpt_practice/week_1
rm -rf .venv
uv sync
```

### Frontend Build Issues

```bash
cd user_management/frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Checking for Errors

### Backend Health Check

```bash
# Check if backend is running
curl http://localhost:8000/docs

# Check database connection
curl http://localhost:8000/users
```

### Frontend Health Check

```bash
# Check if frontend is running
curl http://localhost:5173
```

### View Backend Logs

Backend logs will appear in the terminal where you ran `./run-backend.sh`

### View Frontend Logs

Frontend logs will appear in the terminal where you ran `./run-frontend.sh`

---

## Stopping Services

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Stop Database (if using Docker)
```bash
docker-compose down
```

---

## Environment Variables

The `.env` file has been created with these values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/user_management
SECRET_KEY=supersecretkey123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

You can modify these if needed.

---

## Next Steps

Once you've verified everything works locally:

1. ✅ All tests pass
2. ✅ No errors in console
3. ✅ Database operations work
4. ✅ Frontend loads correctly

Then you can run with Docker:

```bash
docker-compose up --build
```

---

## Project Structure

```
week_1/
├── .env                          # Environment variables
├── run-backend.sh               # Backend startup script
├── run-frontend.sh              # Frontend startup script
├── docker-compose.yml           # Docker orchestration
├── pyproject.toml               # Python dependencies
└── user_management/
    ├── backend/
    │   └── app/
    │       ├── main.py          # FastAPI app
    │       ├── models.py        # Database models
    │       ├── schemas.py       # Pydantic schemas
    │       └── databases.py     # DB connection
    └── frontend/
        └── src/
            ├── components/      # Reusable components
            ├── pages/          # Page components
            ├── types/          # TypeScript types
            └── lib/            # API services
```
