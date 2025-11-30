# 🚀 How to Run This Project Locally

## ✅ What I've Set Up For You

1. **Fixed all code issues:**
   - ✅ Fixed import error (database vs databases)
   - ✅ Added SQLite support for easy testing
   - ✅ Created environment configuration (.env)
   - ✅ Fixed TypeScript errors in frontend
   - ✅ Refactored frontend into clean architecture

2. **Created helper scripts:**
   - ✅ `run-backend.sh` - Start backend with one command
   - ✅ `run-frontend.sh` - Start frontend with one command
   - ✅ `.env` - Environment variables configured

3. **Documentation:**
   - ✅ `QUICKSTART.md` - Quick reference guide
   - ✅ `LOCAL_SETUP.md` - Detailed setup instructions
   - ✅ This file - Summary and commands

---

## 🎯 Run the Project (Super Simple)

### **Terminal 1 - Backend:**

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-backend.sh
```

Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### **Terminal 2 - Frontend:**

```bash
cd /home/nguyen/code/fpt_practice/week_1
./run-frontend.sh
```

Wait for: `VITE v7.2.4  ready in ...ms`

### **Open Browser:**

http://localhost:5173

---

## 🧪 Test Everything Works

### 1. Register a User
- Go to http://localhost:5173
- Click "Register"
- Fill in: username, email, password
- Click "Register"

### 2. Login
- Click "Login"
- Enter your credentials
- You should see the Dashboard

### 3. Check Dashboard
- See your user in the table
- Try the "Templates" tab

### 4. API Documentation
- Open http://localhost:8000/docs
- Try the endpoints interactively

---

## 🐛 Error Checking

### Check Backend Health:
```bash
# Should return 200 and show docs
curl -I http://localhost:8000/docs

# Should show empty array or users
curl http://localhost:8000/users
```

### Check Frontend Health:
```bash
# Should return HTML
curl http://localhost:5173
```

### Check Database:
```bash
# If using SQLite, the database file should exist:
ls -lh user_management/backend/user_management.db
```

### View Logs:
- **Backend logs:** Check Terminal 1 where you ran `run-backend.sh`
- **Frontend logs:** Check Terminal 2 where you ran `run-frontend.sh`
- **Browser logs:** Press F12 in browser, check Console tab

---

## 🔧 Common Fixes

### "Port already in use"
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### "ModuleNotFoundError"
```bash
cd /home/nguyen/code/fpt_practice/week_1
uv sync
```

### "Database connection failed"
The project is configured to use SQLite by default (no setup needed!)

If you want to use PostgreSQL instead:
1. Edit `.env`
2. Uncomment the PostgreSQL line
3. Comment out the SQLite line
4. Create the database: `createdb user_management`

---

## 📊 Current Configuration

### Database: **SQLite** (file: `user_management.db`)
- No setup required
- Perfect for testing
- Works immediately

### Backend: **FastAPI** on http://localhost:8000
- Auto-reload enabled (changes reflect immediately)
- API docs at /docs

### Frontend: **React + Vite** on http://localhost:5173
- Hot module reload (instant updates)
- TypeScript enabled
- Tailwind CSS configured

---

## 🎨 Frontend Architecture (Refactored)

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── ui/           # Button, Input, Card
├── pages/            # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── EmailTemplates.tsx
├── types/            # TypeScript interfaces
├── lib/              # API services
└── App.tsx          # Main app (now only 42 lines!)
```

---

## ✨ What's Different from Docker

| Aspect | Local | Docker |
|--------|-------|--------|
| Database | SQLite (file) | PostgreSQL (container) |
| Backend Port | 8000 | 8000 |
| Frontend Port | 5173 | 3000 (via Nginx) |
| Hot Reload | ✅ Yes | ⚠️ Limited |
| Debugging | ✅ Easy | ⚠️ Harder |
| Setup Time | ⚡ Instant | 🐌 Build time |

---

## 🚀 When You're Ready for Docker

Once you've tested everything locally and confirmed no errors:

```bash
# Stop local servers (Ctrl+C in both terminals)

# Update docker-compose.yml database URL
# Change: sqlite:///./user_management.db
# To: postgresql://postgres:postgres@db:5432/user_management

# Run with Docker
docker compose up --build

# Access at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📝 Files Created/Modified

**Created:**
- ✅ `.env` - Environment configuration
- ✅ `run-backend.sh` - Backend startup script
- ✅ `run-frontend.sh` - Frontend startup script
- ✅ `QUICKSTART.md` - Quick reference
- ✅ `LOCAL_SETUP.md` - Detailed guide
- ✅ `README_RUN_LOCALLY.md` - This file

**Modified:**
- ✅ `user_management/backend/app/main.py` - Fixed import
- ✅ `user_management/backend/app/databases.py` - Added SQLite support
- ✅ `user_management/frontend/src/App.tsx` - Refactored (346 → 42 lines)
- ✅ `user_management/frontend/tailwind.config.js` - Fixed configuration
- ✅ `user_management/frontend/src/index.css` - Added Tailwind directives

**Refactored Frontend:**
- ✅ Created `src/components/` - Navbar, ProtectedRoute, UI components
- ✅ Created `src/pages/` - Login, Register, Dashboard, EmailTemplates
- ✅ Created `src/types/` - TypeScript interfaces
- ✅ Created `src/lib/` - API service layer

---

## 🎯 Summary

**To run the project right now:**
1. Open 2 terminals
2. Run `./run-backend.sh` in Terminal 1
3. Run `./run-frontend.sh` in Terminal 2
4. Open http://localhost:5173 in browser
5. Test registration, login, dashboard

**Everything should just work!**

The project is configured to use SQLite (no database setup needed), all dependencies will auto-install, and you can start coding immediately.

---

## 💡 Pro Tips

1. Keep both terminals visible to see logs
2. Use `Ctrl+C` to stop servers gracefully
3. Check browser console (F12) for frontend errors
4. Use http://localhost:8000/docs to test API endpoints
5. Backend and frontend auto-reload when you save changes

Happy coding! 🚀
