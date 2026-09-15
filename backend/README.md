# Backend Setup

The backend uses **FastAPI (Python)** and connects to a **MySQL** database.

Each team member must create their own Python virtual environment and `.env` file after cloning the repository.

---

## 1. Navigate to the Backend Folder

From the root of the project:

```bash
cd backend
```

---

## 2. Create a Python Virtual Environment

Make sure Python **3.13.x** is installed.

### Windows

Create the virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the required packages:

```powershell
pip install -r requirements.txt
```

### Mac / Linux

Create the virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

---

## 3. Create the `.env` File

The `.env` file contains the information needed for FastAPI to connect to your local MySQL database.

Inside the `backend` folder, create a file named:

```text
.env
```

Your backend folder should look similar to:

```text
backend/
├── app/
│   ├── database.py
│   └── main.py
├── .env
├── requirements.txt
├── schema.sql
└── README.md
```

Add the following to your `.env` file:

```env
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=TMS
```

For example:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=TMS
```

**DO NOT put your actual MySQL password in the README or push your `.env` file to GitHub.**

Each team member should use the username and password for their own local MySQL installation.

---

## 4. Create the MySQL Database

Open MySQL Workbench and run:

```text
backend/schema.sql
```

This will create the `TMS` database and all of the tables needed by the project.

---

## 5. Run the FastAPI Backend

Make sure:

- Your virtual environment is activated.
- MySQL is running.
- You have executed `schema.sql`.
- Your `.env` contains your correct MySQL information.

From inside the `backend` folder run:

```bash
uvicorn app.main:app --reload
```

FastAPI should start at:

```text
http://127.0.0.1:8000
```

Opening that address should return:

```json
{
    "status": "success",
    "msg": "Database Connected Successfully"
}
```

You can also view the FastAPI Swagger documentation at:

```text
http://127.0.0.1:8000/docs
```

---

## IMPORTANT: `.gitignore`

The virtual environment and `.env` file should **NEVER** be pushed to GitHub.

Make sure the project's `.gitignore` contains:

```gitignore
.venv/
.env
__pycache__/
*.pyc
```

Because `.env` is ignored by Git, **every team member must create their own `.env` file after cloning the repository.**