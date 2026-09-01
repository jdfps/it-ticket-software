# IT Ticket System - Database Documentation

## Overview

The database stores the information needed for the IT Ticket System.

The initial database contains three main tables:

* `USERS`
* `TECHNICIANS`
* `TICKETS`

Employees use the system to create IT support tickets. Technicians can then view and manage tickets submitted by employees.

---

## USERS

The `USERS` table stores information about employees who use the ticket system.

| Column       | Type         | Description                                                       |
| ------------ | ------------ | ----------------------------------------------------------------- |
| `user_id`    | INT          | Unique ID for each user. Primary key and automatically generated. |
| `first_name` | VARCHAR(50)  | User's first name.                                                |
| `last_name`  | VARCHAR(50)  | User's last name.                                                 |
| `email`      | VARCHAR(100) | User's email address. Must be unique.                             |
| `password`   | VARCHAR(255) | Stores the user's hashed password.                                |

### Primary Key

`user_id`

Each user receives a unique ID when their account is created.

---

## TECHNICIANS

The `TECHNICIANS` table stores information about IT technicians who can manage support tickets.

| Column          | Type         | Description                                                             |
| --------------- | ------------ | ----------------------------------------------------------------------- |
| `technician_id` | INT          | Unique ID for each technician. Primary key and automatically generated. |
| `first_name`    | VARCHAR(50)  | Technician's first name.                                                |
| `last_name`     | VARCHAR(50)  | Technician's last name.                                                 |
| `email`         | VARCHAR(100) | Technician's email address. Must be unique.                             |
| `password`      | VARCHAR(255) | Stores the technician's hashed password.                                |

### Primary Key

`technician_id`

Each technician receives a unique ID when their account is created.

---

## TICKETS

The `TICKETS` table stores IT support tickets created by users.

| Column          | Type         | Description                                                                               |
| --------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `ticket_id`     | INT          | Unique ID for each ticket. Primary key and automatically generated.                       |
| `user_id`       | INT          | ID of the user who created the ticket.                                                    |
| `technician_id` | INT          | ID of the technician assigned to the ticket. Can be NULL if nobody has been assigned yet. |
| `title`         | VARCHAR(100) | Short title describing the problem.                                                       |
| `description`   | TEXT         | Detailed description of the IT problem.                                                   |
| `enter_date`    | DATETIME     | Date and time the ticket was created. Automatically set when the ticket is entered.       |
| `due_date`      | DATETIME     | Date and time the ticket should be completed by.                                          |

### Primary Key

`ticket_id`

Each ticket receives a unique ID when it is created.

### Foreign Keys

`user_id` references:

`USERS(user_id)`

This connects a ticket to the employee who created it.

`technician_id` references:

`TECHNICIANS(technician_id)`

This connects a ticket to the technician assigned to work on it.

---

## Database Relationships

The database currently has two main relationships:

### User → Tickets

One user can create multiple tickets.

Each ticket belongs to one user.

```text
USERS
  |
  | 1
  |
  | Many
  v
TICKETS
```

### Technician → Tickets

One technician can be assigned multiple tickets.

Each ticket can be assigned to one technician.

```text
TECHNICIANS
      |
      | 1
      |
      | Many
      v
   TICKETS
```

A ticket does not have to immediately have a technician assigned to it. Because of this, `technician_id` is allowed to be `NULL`.

---

## Example

An employee named John Smith creates a ticket because his computer will not start.

The user might have:

```text
user_id = 5
```

When the ticket is created, the `TICKETS` table could contain:

```text
ticket_id       = 12
user_id         = 5
technician_id   = NULL
title           = Computer Will Not Start
description     = My computer will not turn on after pressing the power button.
enter_date      = 2026-09-01 12:30:00
due_date        = 2026-09-03 17:00:00
```

Later, technician `3` is assigned to the ticket:

```text
technician_id = 3
```

The ticket is now connected to both the employee who submitted it and the technician responsible for handling it.

---

## Current Database Structure

```text
USERS
-----
PK user_id
   first_name
   last_name
   email
   password


TECHNICIANS
-----------
PK technician_id
   first_name
   last_name
   email
   password


TICKETS
-------
PK ticket_id
FK user_id
FK technician_id
   title
   description
   enter_date
   due_date
```

This is the initial database structure. Additional features and tables can be added as the project develops.
