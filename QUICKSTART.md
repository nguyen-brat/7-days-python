# ⚡ Quick Start Guide

## 🎯 Running Locally (3 Simple Steps)

### Step 1: Setup Database (Choose One Option)

#### **Option A: Use Existing Local PostgreSQL (You have this running)**

Your PostgreSQL is already running on port 5432! Just create the database:

```bash
# If you have a postgres user set up:
createdb -U postgres user_management

# OR if using your system user:
createdb user_management

# OR using psql directly:
psql -d postgres -c "CREATE DATABASE user_management;"
```

Update the `.env` file to match your PostgreSQL setup:
```bash
# If using system user (nguyen):
DATABASE_URL=postgresql://nguyen@localhost:5432/user_management

# If using postgres user:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/user_management
```

#### **Option B: Use SQLite (No PostgreSQL Setup Required)**

For quick testing, modify the backend to use SQLite:

1. Edit `/home/nguyen/code/fpt_practice/week_1/user_management/backend/app/databases.py`
2. Change line 7 to:
```python
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./user_management.db")
```

Then update `.env`:
```env
DATABASE_URL=sqlite:///./user_management.db
```

---

### Step 2: Start Backend (Terminal 1)

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-backend.sh
```

**Expected Output:**
```
🚀 Starting Backend Server...
📦 Installing dependencies...
🔧 Starting FastAPI server...
Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test it:**
```bash
curl http://localhost:8000/docs
```

---

### Step 3: Start Frontend (Terminal 2)

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-frontend.sh
```

**Expected Output:**
```
🚀 Starting Frontend Server...
🔧 Starting Vite dev server...

  VITE v7.2.4  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open Browser:** http://localhost:5173

---

## ✅ Testing Checklist

Before running with Docker, verify:

### Backend Tests:

```bash
# 1. API is responding
curl http://localhost:8000/docs

# 2. Health check (should return 404, but server is working)
curl http://localhost:8000/

# 3. Create a user
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'

# 4. Login
curl -X POST http://localhost:8000/token \
  -d "username=testuser&password=test123"
```

### Frontend Tests:

1. ✅ Page loads at http://localhost:5173
2. ✅ Can navigate to /register
3. ✅ Can create an account
4. ✅ Can login
5. ✅ Dashboard shows users
6. ✅ Can create email templates
7. ✅ No errors in browser console (F12)

---

## 🐛 Common Issues & Fixes

### Issue 1: "ModuleNotFoundError: No module named 'app'"

**Fix:**
```bash
cd /home/nguyen/code/fpt_practice/week_1
export PYTHONPATH="${PYTHONPATH}:/home/nguyen/code/fpt_practice/week_1/user_management/backend"
./run-backend.sh
```

### Issue 2: "sqlalchemy.exc.OperationalError: connection failed"

**Fix:** Database isn't set up. Use Option B (SQLite) from Step 1.

### Issue 3: "Port 8000 already in use"

**Fix:**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9
```

### Issue 4: "CORS error" in browser console

**Fix:** Make sure backend is running first, then start frontend.

### Issue 5: Frontend shows "Failed to fetch"

**Fix:** Check that:
1. Backend is running on port 8000
2. Database is connected
3. No CORS errors in browser console

---

## 📊 Expected File Structure After Setup

```
week_1/
├── .env                     # ✅ Created
├── .venv/                   # ✅ Created by uv
├── run-backend.sh           # ✅ Created
├── run-frontend.sh          # ✅ Created
├── LOCAL_SETUP.md           # ✅ Created
├── QUICKSTART.md            # ✅ This file
└── user_management/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py
    │   │   └── ...
    │   └── user_management.db  # ✅ If using SQLite
    └── frontend/
        ├── node_modules/    # ✅ Created by npm install
        └── dist/           # ✅ Created by npm build
```

---

## 🚀 Ready for Docker?

Once everything works locally:

```bash
# Stop local services (Ctrl+C in both terminals)

# Run with Docker
docker compose up --build

# Access at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

---

## 💡 Tips

1. **Keep terminals open**: Don't close the terminal windows while services are running
2. **Check logs**: If something breaks, the error will show in the terminal
3. **Browser DevTools**: Press F12 to see frontend errors
4. **API Docs**: http://localhost:8000/docs is your friend for testing backend
5. **Hot Reload**: Both backend and frontend auto-reload when you change code

---

## 🆘 Still Having Issues?

1. Check if ports are available:
   ```bash
   lsof -i :5432  # Database
   lsof -i :8000  # Backend
   lsof -i :5173  # Frontend
   ```

2. Check if services are running:
   ```bash
   ps aux | grep uvicorn  # Backend
   ps aux | grep vite     # Frontend
   ```

3. Read the error messages in the terminal - they usually tell you what's wrong!
