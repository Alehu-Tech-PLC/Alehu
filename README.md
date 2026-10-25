# Alehu AI

Smart child safety systems: a Next.js guardian experience, a Flask + PostgreSQL API, and a wearable ingest path.

Keep product materials in this repository confidential.

---

## Structure

```
Alehu/
├── backend/     Flask API, PostgreSQL, JWT, alerts, device ingest
├── frontend/    Next.js 15 marketing site + guardian dashboard
└── docs/        Business and technical PDFs
```

---

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
flask db upgrade
python run.py --seed
python run.py
```

API: `http://127.0.0.1:5000`  
Health: `GET /api/health`

Seed login: `admin@alehu.com` / `Admin123!`

---

## Frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Site: `http://localhost:3000`  
Dashboard: `http://localhost:3000/login`

---

## Documentation

Generate presentation PDFs:

```powershell
python docs/generate_docs.py
```

Outputs:

- `docs/Alehu_Business_Presentation.pdf`
- `docs/Alehu_Technical_Documentation.pdf` (includes hardware bill of materials)
