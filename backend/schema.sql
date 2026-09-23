DROP DATABASE IF EXISTS TMS;

CREATE DATABASE TMS;

USE TMS;


-- =========================================================
-- USERS
-- Employees, Technicians, and Admins all live in this table
-- =========================================================

CREATE TABLE users
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    -- Store the HASHED password, never the plain-text password
    password_hash VARCHAR(255) NOT NULL,

    -- Determines which dashboard / permissions the user gets
    role ENUM(
        'employee',
        'technician',
        'admin'
    ) NOT NULL DEFAULT 'employee',

    -- Admin-created users start with a temporary password.
    -- After they create their real password this becomes FALSE.
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- CATEGORIES
-- Categories employees can select when creating tickets
-- =========================================================

CREATE TABLE categories
(
    category_id INT AUTO_INCREMENT PRIMARY KEY,

    category_name VARCHAR(255) UNIQUE NOT NULL
);


-- =========================================================
-- TICKETS
-- Main support ticket table
-- =========================================================

CREATE TABLE tickets
(
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,

    -- Employee who created the ticket
    user_id INT NOT NULL,

    -- Technician who claimed the ticket
    -- NULL means nobody has claimed it yet
    tech_id INT NULL,

    -- Ticket category
    category_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,


    -- =====================================================
    -- TICKET WORKFLOW
    --
    -- pending:
    -- Employee submitted it, waiting for admin
    --
    -- open:
    -- Admin approved it and assigned priority.
    -- Technicians can now see/claim it.
    --
    -- in_progress:
    -- Technician claimed the ticket.
    --
    -- resolved:
    -- Technician completed the ticket.
    --
    -- rejected:
    -- Admin rejected the ticket.
    -- =====================================================

    status ENUM(
        'pending',
        'open',
        'in_progress',
        'resolved',
        'rejected'
    ) NOT NULL DEFAULT 'pending',


    -- =====================================================
    -- PRIORITY
    --
    -- NULL while waiting for admin review
    --
    -- P1 = 1 day
    -- P2 = 2 days
    -- P3 = 3 days
    -- P4 = 4 days
    -- P5 = 5 days
    -- =====================================================

    priority TINYINT NULL,


    -- When employee submitted the ticket
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Set when admin approves ticket and assigns priority
    due_date DATETIME NULL,

    -- Set when technician resolves ticket
    resolved_at DATETIME NULL,


    -- =====================================================
    -- FOREIGN KEYS
    -- =====================================================

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_ticket_technician
        FOREIGN KEY (tech_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id),

    -- Priority can either be NULL (pending/rejected)
    -- or a number from 1-5
    CONSTRAINT chk_ticket_priority
        CHECK (
            priority IS NULL
            OR priority BETWEEN 1 AND 5
        )
);


-- =========================================================
-- COMMENTS
-- Employee and Technician conversation on a ticket
-- =========================================================

CREATE TABLE comments
(
    comment_id INT AUTO_INCREMENT PRIMARY KEY,

    -- Ticket this comment belongs to
    ticket_id INT NOT NULL,

    -- User who wrote the comment
    author_id INT NOT NULL,

    comment_text TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_comment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(ticket_id),

    CONSTRAINT fk_comment_author
        FOREIGN KEY (author_id)
        REFERENCES users(user_id)
);


-- =========================================================
-- INDEXES
-- Makes common ticket searches faster
-- =========================================================

CREATE INDEX idx_tickets_user
    ON tickets(user_id);

CREATE INDEX idx_tickets_technician
    ON tickets(tech_id);

CREATE INDEX idx_tickets_status
    ON tickets(status);

CREATE INDEX idx_comments_ticket
    ON comments(ticket_id);


-- =========================================================
-- DEFAULT CATEGORIES
-- Change/add these later if needed
-- =========================================================

INSERT INTO categories (category_name)
VALUES
    ('Hardware'),
    ('Software'),
    ('Network'),
    ('Account / Access'),
    ('Email'),
    ('Other');