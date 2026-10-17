# Alehu Project

A fullstack application architecture containing both the backend API and frontend client in a unified repository.

---

## 📁 Repository Structure

```
Alehu/
├── backend/            # Flask + PostgreSQL REST API
│   ├── app/            # Application factory, models, routes, schemas, services
│   ├── migrations/     # Database migration scripts
│   ├── tests/          # Automated pytest suite (42 tests)
│   ├── README.md       # Detailed backend API reference
│   ├── SETUP_GUIDE.md  # Step-by-step setup guide for fresh clones
│   └── run.py          # Backend entry point
├── frontend/           # Frontend client application (coming soon / configurable)
├── .gitignore          # Root ignore rules for Python & Node ecosystems
└── README.md           # Fullstack project overview
```

---

## 🚀 Getting Started

### 1. Backend Setup (Flask + PostgreSQL)
For detailed setup instructions, database migrations, and testing:
- 📖 [Backend Setup Guide](backend/SETUP_GUIDE.md)
- 📖 [Backend API Documentation](backend/README.md)
- 📮 Postman Collection: `backend/Alehu_API.postman_collection.json`

Quick start:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python run.py
```

### 2. Frontend Setup
*(When frontend is initialized)*
```powershell
cd frontend
npm install
npm run dev
```

---

## 🌿 Git Workflow

Since this repository root holds both `backend` and `frontend`, any commits and branches track the entire fullstack project together:

```powershell
# Stage all fullstack changes
git add .

# Commit
git commit -m "feat: setup fullstack structure with backend API"

# Push
git push origin master
```
