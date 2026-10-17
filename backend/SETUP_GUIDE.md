# Complete Backend Setup & Installation Guide

This guide provides **exact, copy-paste step-by-step commands** for anyone who clones or downloads this project from Git to get the backend 100% operational from scratch.

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have the following installed on your machine:

1. **Python 3.11+ or 3.12+**
   - Verify in terminal: `python --version`
2. **PostgreSQL (v15, 16, or 17)**
   - Verify service is running. Default port is `5432`.
3. **Git**
   - Verify in terminal: `git --version`
4. **Postman** *(Optional, for testing API endpoints)*

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Open Terminal and Navigate to the Backend Folder

#### Windows (PowerShell):
```powershell
cd backend
```

#### macOS / Linux:
```bash
cd backend
```

---

### Step 2: Create a Virtual Environment

Isolate dependencies so they do not conflict with your global Python setup.

#### Windows (PowerShell):
```powershell
python -m venv .venv
```

#### macOS / Linux:
```bash
python3 -m venv .venv
```

---

### Step 3: Activate the Virtual Environment

#### Windows (PowerShell):
```powershell
.\.venv\Scripts\Activate.ps1
```

> **Note for Windows Users:** If you see an error saying *"running scripts is disabled on this system"*, run this once:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Then run `.\.venv\Scripts\Activate.ps1` again.

#### macOS / Linux:
```bash
source .venv/bin/activate
```

When activated, you will see `(.venv)` at the beginning of your terminal prompt line.

---

### Step 4: Install Required Packages

Install all required dependencies:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 5: Configure the `.env` Environment File

Create your local `.env` file from `.env.example`:

#### Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

#### macOS / Linux:
```bash
cp .env.example .env
```

Now open `.env` in your text editor (such as VS Code or Notepad) and update your database credentials if different from default:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=change-this-to-any-random-secret-key-12345
JWT_SECRET_KEY=change-this-to-any-jwt-secret-key-67890

DB_HOST=localhost
DB_PORT=5432
DB_NAME=alehu
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD_HERE@localhost:5432/alehu
```

*(Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual local PostgreSQL password).*

---

### Step 6: Create the PostgreSQL Database

Make sure PostgreSQL is running, then create the database named `alehu`:

#### Option A: Using PostgreSQL `psql` command line
```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE alehu;"
```
*(Enter your PostgreSQL password when prompted).*

#### Option B: Using pgAdmin GUI
1. Open **pgAdmin**.
2. Right-click **Databases** ➔ **Create** ➔ **Database...**
3. Set Database name to: `alehu`
4. Click **Save**.

---

### Step 7: Apply Database Migrations

Apply the migration versions to create all 6 tables (`users`, `roles`, `permissions`, `role_permissions`, `customers`, `devices`):

```powershell
flask db upgrade
```

You should see output similar to:
```text
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade -> 4fa1f38381d2, initial migration
```

---

### Step 8: Seed Default Sample Data

Populate the database with initial roles (`admin`, `user`), default permissions, sample users, customers, and devices:

```powershell
python run.py --seed
```

Output:
```text
  + Role: admin
  + Role: user
  + Permission: users:read
  + Permission: users:write
  + Permission: devices:manage
  + Assigned 'users:read' → admin role
  + User: admin@alehu.com
  + User: john@alehu.com
  + Customer: TechCorp
  + Device: Router-01
✓ Seed complete.
```

---

### Step 9: Verify with Automated Tests

Run the full test suite to confirm everything is working properly:

```powershell
pytest -v
```

Expected result:
```text
====================== 42 passed in 15.00s ======================
```

---

### Step 10: Start the Backend Server

Start the development server:

```powershell
python run.py
```

The server is now live at:
👉 **`http://127.0.0.1:5000`**

Keep this terminal window running!

---

## 🔑 Default Accounts (Ready to Use)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@alehu.com` | `Admin123!` | Full Access (`users`, `roles`, `permissions`, `customers`, `devices`) |
| **User** | `john@alehu.com` | `User123!` | Read & Manage (`customers`, `devices`, own profile) |

---

## 📮 How to Test with Postman

1. Open **Postman**.
2. Click the **Import** button in the top left.
3. Select the file from this repository:
   ```text
   backend/Alehu_API.postman_collection.json
   ```
4. Expand the **Alehu Backend API** collection in the sidebar.
5. Go to **1. Authentication** ➔ **Login (Admin)**.
6. Click **Send**.
7. The collection automatically saves the returned JWT `access_token` into Postman variables!
8. You can now click and run **any** CRUD request:
   - `GET /api/customers`
   - `POST /api/customers`
   - `GET /api/devices`
   - `POST /api/devices`
   - `GET /api/users`
   - `GET /api/roles`

---

## ⚡ Quick End-to-End Test via PowerShell

If you don't have Postman open, you can test all live endpoints with a single command!

While `python run.py` is running in one terminal, open a **second terminal window** and run:

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File .\api_tests.ps1
```

This will automatically execute login, profile lookup, customer CRUD, device CRUD, role inspection, and token verification against your running server.

---

## 🛠️ Common Troubleshooting

### 1. `password authentication failed for user "postgres"`
- Check the `DB_PASSWORD` value in your [.env](file:///d:/project/tpproject/Alehu/backend/.env) file. Make sure it matches what you set during your PostgreSQL installation.

### 2. `database "alehu" does not exist`
- Run Step 6 to create the database:
  ```powershell
  psql -U postgres -c "CREATE DATABASE alehu;"
  ```

### 3. `Address already in use (Port 5000)`
- Another program is using port 5000. Stop it, or change the port in `run.py` (e.g. `port=5001`).

### 4. PowerShell script execution blocked
- Run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
