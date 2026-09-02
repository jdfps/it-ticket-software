# CloudDesk - Cloud-Based IT Ticketing System
## Fall 2026 Database Management Systems CSCI-4560-001
## Dr. Khem N. Poudel

### Team Members:
1. Justin Blackwell
2. Julio Clavasquin
3. Dominic Zeferin
4. Ciwan Kapan

# IT Ticket Software

A web-based IT help desk and ticket management system designed for use within a company. Employees can submit IT support tickets, while IT technicians can view, manage, comment on, and resolve those tickets.

This project is being developed as part of a Database Management Systems course and will eventually be deployed using cloud services.

## Project Overview

The IT Ticket Software allows employees within a company to report IT-related problems through a centralized ticketing system.

Employees can log into the system and create support tickets describing their issue. IT technicians can then access submitted tickets, communicate with users through comments, manage ticket information, and close tickets once the issue has been resolved.

The system is designed around a MySQL relational database and uses a FastAPI backend to communicate between the database and the frontend.

## Features

### Employees

Employees will be able to:

* Log into the system
* Create support tickets
* View their submitted tickets
* View ticket status
* View ticket due dates
* Add comments to tickets
* Edit applicable ticket information

### IT Technicians

Technicians will be able to:

* Log into the system
* View tickets submitted by employees
* View open tickets
* View ticket due dates
* Assign technicians to tickets
* Add comments to tickets
* Update ticket information
* Close resolved tickets

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

The frontend provides the user interface and communicates with the backend using HTTP requests.

### Backend

* Python
* FastAPI
* SQLAlchemy
* Uvicorn

FastAPI provides the API used by the frontend to retrieve and modify information stored in the database.

### Database

* MySQL

MySQL stores the application's users, technicians, tickets, comments, and related information.

### Cloud

The completed application is planned to eventually be hosted using a cloud platform such as AWS or Azure.

Development will initially be performed locally before the application is moved to the cloud.

## Application Architecture

The application follows a basic three-layer structure:

```text
Frontend
   |
   | HTTP Requests
   v
FastAPI Backend
   |
   | SQL Queries / SQLAlchemy
   v
MySQL Database
```

The frontend should never communicate directly with the MySQL database.

Instead, the frontend sends requests to the FastAPI backend.

For example:

```text
User opens ticket page
        |
        v
JavaScript sends GET /tickets
        |
        v
FastAPI receives request
        |
        v
FastAPI queries MySQL
        |
        v
MySQL returns ticket data
        |
        v
FastAPI returns JSON
        |
        v
JavaScript displays tickets
```

## Project Structure

The project is organized into three main sections:

```text
it-ticket-software/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   └── ...
│   │
│   ├── .env
│   └── requirements.txt
│
├── database/
│   ├── schema.sql
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── index.css
│   │
│   ├── pages/
│   │   ├── login.html
│   │   └── ...
│   │
│   └── js/
│       └── ...
│
├── .gitignore
└── README.md
```

The structure may change as additional features are added.

## Database

The database is built using MySQL.

The initial database contains the core tables required by the ticket system, including:

* Users
* Technicians
* Tickets
* Comments

Additional tables and relationships may be added as the project develops.

The database schema is stored inside:

```text
database/schema.sql
```

The schema file allows team members to recreate the database on their own local MySQL installation.

## Database Relationships

The general relationship between the main tables is:

```text
USERS
  |
  | creates
  v
TICKETS
  |
  | assigned to
  v
TECHNICIANS

USERS / TECHNICIANS
  |
  | add
  v
COMMENTS
  |
  | belong to
  v
TICKETS
```

Foreign keys are used to connect related records between tables.

For example, a ticket can contain the ID of the employee who created it and the ID of the technician assigned to it.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Enter the project directory:

```bash
cd it-ticket-software
```

## 2. Create a Python Virtual Environment

Enter the backend directory:

```bash
cd backend
```

Create the virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

## 3. Install Python Dependencies

Install the required packages:

```bash
pip install -r requirements.txt
```

## 4. Configure MySQL

Make sure MySQL Server is installed and running.

Create the database by running the project's schema file.

For example:

```bash
mysql -u root -p < database/schema.sql
```

Depending on your current directory, the path to `schema.sql` may need to be changed.

You can also open `schema.sql` using a MySQL database management program and execute it manually.

## 5. Configure Environment Variables

Database credentials should not be stored directly inside the Python source code.

Create a `.env` file inside the backend directory.

Example:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=it_ticket_system
```

Each developer should use their own local MySQL username and password.

The `.env` file should be included in `.gitignore` and should never be pushed to GitHub.

## 6. Start the FastAPI Backend

From the backend directory with the virtual environment activated, start the development server.

For example:

```bash
uvicorn app.main:app --reload
```

The backend should then run locally on port `8000`.

The FastAPI interactive API documentation can also be accessed through the `/docs` endpoint while the backend is running.

## 7. Start the Frontend

The frontend files are located inside:

```text
frontend/
```

During development, the frontend can be opened using a local development server such as the VS Code Live Server extension.

The frontend JavaScript can communicate with the FastAPI backend using requests such as:

```javascript
fetch("http://127.0.0.1:8000/tickets")
```

## API

The FastAPI backend will provide endpoints used by the frontend.

Examples of endpoints that may be implemented include:

```text
GET    /tickets
GET    /tickets/{ticket_id}
POST   /tickets
PUT    /tickets/{ticket_id}
DELETE /tickets/{ticket_id}

GET    /users
POST   /users

GET    /technicians

GET    /tickets/{ticket_id}/comments
POST   /tickets/{ticket_id}/comments
```

The exact API structure may change as development continues.

## Git Workflow

The `main` branch should contain the stable version of the project.

Team members should create branches when working on new features.

Create a branch:

```bash
git checkout -b feature-name
```

Example:

```bash
git checkout -b login-page
```

Make changes and commit them:

```bash
git add .
git commit -m "Create login page"
```

Push the branch:

```bash
git push -u origin login-page
```

The changes can then be reviewed and merged into `main`.

Before beginning new work, team members should make sure their local `main` branch is updated:

```bash
git checkout main
git pull
```

Then create a new branch from the updated `main` branch.

## Development Plan

The project will be developed in stages.

### Initial Development

* Create MySQL database
* Create project structure
* Connect FastAPI to MySQL
* Create basic frontend
* Create login interface

### Core Functionality

* User authentication
* Create tickets
* View tickets
* Edit tickets
* Assign technicians
* Add comments
* Manage due dates
* Close tickets

### Final Development

* Improve frontend design
* Add validation and error handling
* Improve security
* Test database relationships
* Test API endpoints
* Deploy application to the cloud

## Security

Sensitive information should never be committed to the repository.

This includes:

* Database passwords
* API keys
* Cloud credentials
* Secret keys
* Authentication secrets

These values should be stored in environment variables or `.env` files that are excluded through `.gitignore`.

## Project Goal

The goal of this project is to demonstrate how a relational database can be integrated into a complete web application.

The project demonstrates concepts including:

* Relational database design
* Primary keys
* Foreign keys
* SQL queries
* Database relationships
* REST APIs
* Backend development
* Frontend/backend communication
* User authentication
* Git and GitHub collaboration
* Cloud deployment

## Contributors

Developed as a group project for a Database Management Systems course at Middle Tennessee State University.
