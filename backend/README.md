# Alehu Backend API

A production-ready REST API backend built with **Python 3.12**, **Flask 3.0**, **SQLAlchemy 2.0**, **Flask-Migrate**, and **PostgreSQL 17**.

Features secure JWT authentication, role-based access control (RBAC), Marshmallow request/response validation, automated pagination, standardized JSON envelopes, wearable telemetry ingest, safety alerts, CORS for the Next.js app, an automated test suite, and an interactive Postman collection.

> 📖 **First time cloning this repository?** Follow the step-by-step [Fresh Clone Setup Guide (SETUP_GUIDE.md)](SETUP_GUIDE.md) to get the backend running in under 5 minutes.

---

## 🚀 Tech Stack

- **Framework:** Flask 3.0.3
- **Database:** PostgreSQL 17
- **ORM:** Flask-SQLAlchemy 3.1.1 & SQLAlchemy 2.0.31
- **Database Migrations:** Flask-Migrate 4.0.7 & Alembic 1.13.2
- **Authentication:** Flask-JWT-Extended 4.6.0 & Flask-Bcrypt 1.0.1
- **Validation & Serialization:** Marshmallow 3.21.3
- **Testing:** Pytest 8.2.2 with in-memory SQLite isolation

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── models/            # SQLAlchemy database models
│   │   ├── user.py        # Users table (auth, password hashing, roles)
│   │   ├── role.py        # Roles table
│   │   ├── permission.py  # Permissions & role_permissions join table
│   │   ├── customer.py    # Customers table (linked to user)
│   │   └── device.py      # Devices table (linked to customer & user)
│   ├── routes/            # Blueprint route handlers
│   │   ├── auth.py        # /api/auth (register, login, refresh, logout, me)
│   │   ├── users.py       # /api/users (CRUD + deactivation, admin-only)
│   │   ├── customers.py   # /api/customers (full CRUD)
│   │   ├── devices.py     # /api/devices (full CRUD)
│   │   ├── roles.py       # /api/roles (CRUD + permission assignment)
│   │   └── permissions.py # /api/permissions (CRUD)
│   ├── schemas/           # Marshmallow input/output schemas
│   ├── services/          # Business logic service layer
│   ├── utils/             # Responses, pagination, and RBAC decorators
│   ├── config.py          # Development, Testing, Production configs
│   ├── extensions.py      # db, migrate, jwt, bcrypt extensions
│   ├── seed.py            # Idempotent database seeder
│   └── __init__.py        # Flask application factory
├── migrations/            # Alembic migration versions
├── tests/                 # Automated test suite (42 tests)
├── .env                   # Local database and secret credentials
├── .env.example           # Template environment variables
├── requirements.txt       # Pinned dependencies
├── run.py                 # Application entry point & CLI commands
├── Alehu_API.postman_collection.json # Ready-to-import Postman Collection
├── api_tests.ps1          # Automated Windows PowerShell API test script
└── api_tests.sh           # Automated bash curl test script
```

---

## ⚙️ Quick Start (Windows PowerShell)

### 1. Open Windows PowerShell in the `backend` folder
```powershell
cd d:\project\tpproject\Alehu\backend
```

### 2. Activate the Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Verify `.env` File Configuration
Your `.env` file is already configured with your local PostgreSQL credentials:
```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alehu
DB_USER=postgres
DB_PASSWORD=12345
DATABASE_URL=postgresql://postgres:12345@localhost:5432/alehu
```

### 4. Create the Database Schema & Seed Sample Data
On a fresh database, apply the committed migrations before seeding:
```powershell
python -m flask --app run.py db upgrade
.\.venv\Scripts\python.exe run.py --seed
```

### 5. Start the Flask Server
```powershell
.\.venv\Scripts\python.exe run.py
```
The server will start listening at:
👉 **`http://127.0.0.1:5000`**

---

## 📮 Using the API with Postman

### Step 1: Import the Collection
1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file:
   `d:\project\tpproject\Alehu\backend\Alehu_API.postman_collection.json`
4. A collection named **Alehu Backend API** will appear.

### Step 2: One-Click Authentication
The collection is equipped with automatic token extraction scripts!
1. Under folder **1. Authentication**, select **Login (Admin)**.
2. Click **Send** (Default credentials: `admin@alehu.com` / `Admin123!`).
3. Postman will automatically capture the returned `access_token` and save it to the collection variable `{{access_token}}`.
4. Now you can immediately click **Send** on **any** CRUD request (`GET Customers`, `POST Device`, `GET Users`, etc.) and they will authenticate automatically!

### Default Seed Credentials
| User | Email | Password | Role |
|------|-------|----------|------|
| **Admin** | `admin@alehu.com` | `Admin123!` | `admin` |
| **Regular User** | `john@alehu.com` | `User123!` | `user` |

---

## 🌐 Complete API Endpoint Reference

### Standard Response Envelope
All API endpoints return a uniform JSON format:
```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "message": "Validation error",
  "errors": { "email": ["Email already registered."] }
}
```

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login with email & password to get JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |
| `POST` | `/api/auth/refresh` | Refresh Token | Issue a new access token |
| `POST` | `/api/auth/logout` | Authenticated | Revoke token (blacklist JTI) |

### 2. Users (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/users?page=1&per_page=10` | Admin | List all users (paginated) |
| `POST` | `/api/users` | Admin | Create a user directly |
| `GET` | `/api/users/<id>` | Authenticated | Get user details by ID |
| `PUT` | `/api/users/<id>` | Admin | Update user details |
| `DELETE` | `/api/users/<id>` | Admin | Soft-delete / deactivate user |

### 3. Customers (`/api/customers`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/customers?page=1&per_page=10` | Authenticated | List customers (paginated) |
| `POST` | `/api/customers` | Authenticated | Create a new customer |
| `GET` | `/api/customers/<id>` | Authenticated | Get customer details by ID |
| `PUT` | `/api/customers/<id>` | Authenticated | Update customer details |
| `DELETE` | `/api/customers/<id>` | Authenticated | Delete customer record |

### 4. Devices (`/api/devices`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/devices?page=1&per_page=10` | Authenticated | List devices (paginated) |
| `POST` | `/api/devices` | Authenticated | Create a new device |
| `GET` | `/api/devices/<id>` | Authenticated | Get device details by ID |
| `PUT` | `/api/devices/<id>` | Authenticated | Update device details |
| `DELETE` | `/api/devices/<id>` | Authenticated | Delete device record |

### 5. Alerts (`/api/alerts`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/alerts` | Authenticated | List safety alerts (filter `acknowledged=true/false`) |
| `POST` | `/api/alerts` | Authenticated | Create an alert |
| `POST` | `/api/alerts/<id>/acknowledge` | Authenticated | Mark an alert handled |

### 6. Dashboard, ingest, health
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/dashboard/summary` | Authenticated | Counts, devices, recent alerts |
| `POST` | `/api/ingest/telemetry` | JWT or `X-Device-Key` | Wearable heartbeat / event ingest |
| `GET` | `/api/health` | Public | Liveness |
| `POST` | `/api/contact` | Public | Partnership inquiry |

### 7. Roles & Permissions (`/api/roles` & `/api/permissions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/roles` | Admin | List all roles |
| `POST` | `/api/roles` | Admin | Create a new role |
| `GET` | `/api/roles/<id>` | Admin | Get role by ID |
| `PUT` | `/api/roles/<id>` | Admin | Update role details |
| `POST` | `/api/roles/<id>/permissions` | Admin | Assign permissions list to role |
| `DELETE` | `/api/roles/<id>` | Admin | Delete role (fails if users assigned) |
| `GET` | `/api/permissions` | Admin | List all permissions |
| `POST` | `/api/permissions` | Admin | Create a permission |
| `GET` | `/api/permissions/<id>` | Admin | Get permission by ID |
| `DELETE` | `/api/permissions/<id>` | Admin | Delete a permission |

---

## 🧪 Automated Testing

### Run Pytest Test Suite
To run the full unit and integration test suite (runs safely using an isolated in-memory database without modifying PostgreSQL):
```powershell
.\.venv\Scripts\pytest.exe -v
```
**Results:** `42 passed in ~15 seconds` (100% pass rate).

### Run Live End-to-End PowerShell API Tests
When your Flask server is running, execute this automated script to verify all live endpoints against PostgreSQL:
```powershell
powershell -ExecutionPolicy Bypass -File .\api_tests.ps1
```

---

## 🗄️ Database Migration Commands

For future model changes:
```powershell
# 1. After editing any model in app/models/
.\.venv\Scripts\flask.exe db migrate -m "Description of changes"

# 2. Apply migration to PostgreSQL
.\.venv\Scripts\flask.exe db upgrade

# 3. Rollback migration if needed
.\.venv\Scripts\flask.exe db downgrade
```
