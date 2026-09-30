# CloudDesk - Cloud-Based IT Ticketing System
## Fall 2026 Database Management Systems CSCI-4560-001
## Dr. Khem N. Poudel

### Team Members:
1. Justin Blackwell
2. Julio Clavasquin
3. Dominic Zeferin
4. Ciwan Kapan

# IT Ticket Software

Cloud-based IT ticketing system created for our CSCI 4560 Database Management Systems project.

The application allows employees to submit IT support tickets, administrators to review and prioritize those tickets, and technicians to claim and resolve them.

## Project Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI / Python
- **Database:** MySQL
- **ORM:** SQLAlchemy

## How the System Works

The basic ticket workflow is:

1. An employee creates a support ticket.
2. The ticket is sent to an administrator for review.
3. The administrator can approve or reject the ticket.
4. If approved, the administrator assigns a priority from P1-P30.
5. Approved tickets become available to technicians.
6. A technician can claim a ticket and work on it.
7. Employees and technicians can communicate through comments on the ticket.
8. The technician resolves the ticket when the issue is finished.

Administrators can also create employee, technician, and administrator accounts.

New users are given a temporary password and are required to create a new password the first time they log in.

## Project Structure

```text
it-ticket-software/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── routers/
│   │
│   ├── schema.sql
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Setup

You will need the following installed:

- Python 3
- Node.js / npm
- MySQL Server
- MySQL Workbench (recommended)
- Git

Clone the repository:

```bash
git clone https://github.com/jdfps/it-ticket-software.git
cd it-ticket-software
```

---

# Backend Setup

The backend uses Python, FastAPI, SQLAlchemy, and MySQL.

## 1. Create a Virtual Environment

From the main project folder:

### Windows PowerShell

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If it worked, your terminal should look similar to:

```text
(.venv) PS C:\...\it-ticket-software>
```

### macOS / Linux

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

Your terminal should now show `(.venv)`.

## 2. Install Python Requirements

With the virtual environment activated:

```bash
pip install -r backend/requirements.txt
```

On macOS, if `pip` is not available, use:

```bash
python3 -m pip install -r backend/requirements.txt
```

---

# Database Setup

Open MySQL Workbench and run:

```text
backend/schema.sql
```

This creates the `TMS` database and the tables needed by the application.

The database contains tables for:

- Users
- Tickets
- Categories
- Comments

It also adds the default ticket categories.

## Create the `.env` File

Inside the `backend` folder, create:

```text
.env
```

Add your own MySQL information:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=TMS
```

Do not commit the `.env` file to GitHub because it contains your database password.

---

# Running the Backend

Make sure the virtual environment is activated.

Move into the backend folder:

### Windows

```powershell
cd backend
```

### macOS / Linux

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

The backend should start at:

```text
http://127.0.0.1:8000
```

FastAPI's Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

You can use the Swagger page to view and test the API routes.

---

# Frontend Setup

Open another terminal.

Move into the frontend folder:

```bash
cd frontend
```

Install the frontend packages:

```bash
npm install
```

Then start the React development server:

```bash
npm run dev
```

Vite should display an address similar to:

```text
http://localhost:5173
```

Open that address in your browser.

Keep both the FastAPI backend and React frontend running while using the application.

---

# Running the Whole Project

After the initial setup, you normally only need two terminals.

### Terminal 1 - Backend

From the project folder, activate the virtual environment.

Windows:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn app.main:app --reload
```

macOS / Linux:

```bash
source .venv/bin/activate
cd backend
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Creating the First Admin Account

Because administrators normally create new users through the application, a new database will not initially have an account that can log in.

Start the backend and go to:

```text
http://127.0.0.1:8000/docs
```

Find:

```text
POST /users
```

Use it to create the first administrator.

Example:

```json
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@test.com",
  "role": "admin",
  "temporary_password": "Admin123!"
}
```

You can then log into the React application using that email and temporary password.

The application will require the administrator to create a new password after the first login.

After that, additional users can be created from the Admin Dashboard.

---

# User Roles

### Employee

Employees can:

- Create support tickets
- View their tickets
- View ticket status
- Communicate with technicians through comments

### Technician

Technicians can:

- View available tickets
- Claim tickets
- View assigned tickets
- Communicate with employees
- Resolve tickets

### Administrator

Administrators can:

- Review new tickets
- Approve or reject tickets
- Assign ticket priority
- Create users
- Monitor tickets

---

# Ticket Status

Tickets move through several statuses:

```text
pending
   ↓
  open
   ↓
in_progress
   ↓
resolved
```

A ticket can also become:

```text
rejected
```

A newly submitted ticket starts as `pending`.

Once an administrator approves it, it becomes `open`.

When a technician claims the ticket, it becomes `in_progress`.

When the technician finishes the issue, it becomes `resolved`.

---

# Notes

- The backend must be running for the frontend to communicate with the database.
- MySQL must also be running.
- New users must change their temporary password when they first log in.
- Ticket comments automatically refresh while the application is open.
- Refreshing the browser does not immediately log the user out.
- Users are automatically logged out after a period of inactivity.
- File attachments are not currently part of the project.