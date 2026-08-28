# CloudDesk - Cloud-Based IT Ticketing System
## Fall 2026 Database Management Systems CSCI-4560-001
## Dr. Khem N. Poudel

### Team Members:
1. Justin Blackwell
2. Julio Clavasquin
3. Dominic Zeferin
4. Ciwan Kapan

### Project Description
The purpose of this project is to create a centralized system for submitting, tracking, and resolving IT
support tickets across departments for businesses or universities.

### Why is this important?
The email ticketing system is small and doesn't allow for proper tracking and organization.

### Features:
1. Ticket submissions by users
2. Assignment to Technicians
3. Department/category/priority classification
4. Comment threads on tickets
5. Status history/audit trail
6. Web Interface (maybe)

### Entities and Key Attributes
**Users**
- user_id (PK)
- name
- email
- phone
- department_id (FK → Departments)
- created_at

**Technicians**
- technician_id (PK)
- name
- email
- department_id (FK → Departments)
- specialization / skill_area
- hire_date

**Departments**
- department_id (PK)
- department_name
- location

**Categories**
- category_id (PK)
- category_name (e.g. Hardware, Software, Network, Access Request)
- description

**Priorities**
- priority_id (PK)
- priority_level (e.g. Low, Medium, High, Critical)
- response_time_sla (hours)

**Tickets**
- ticket_id (PK)
- user_id (FK → Users) — who submitted it
- technician_id (FK → Technicians, nullable) — who it's assigned to
- department_id (FK → Departments)
- category_id (FK → Categories)
- priority_id (FK → Priorities)
- subject
- description
- status (or normalize into Status History as current status)
- created_at
- updated_at
- resolved_at

**Comments**
- comment_id (PK)
- ticket_id (FK → Tickets)
- author_id — could reference either Users or Technicians (see note below)
- author_type (enum: 'user' or 'technician')
- comment_text
- created_at

**Status History**
- history_id (PK)
- ticket_id (FK → Tickets)
- old_status
- new_status
- changed_by (could reference Technicians, or Users/Technicians combined)
- changed_at

### Entity-Relationship Overview


### Database Schema


### Tech Stack/Assigned Roles


### Sample Queries

















