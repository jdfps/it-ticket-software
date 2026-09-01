DROP DATABASE IF EXISTS it_ticket_system;

CREATE DATABASE it_ticket_system;

USE it_ticket_system;


CREATE TABLE USERS
(
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role             ENUM('user', 'technician') NOT NULL DEFAULT 'user'
);


CREATE TABLE TECHNICIANS
(
    technician_id   INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL
);


CREATE TABLE TICKETS
(
    ticket_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    technician_id   INT,

    title           VARCHAR(100) NOT NULL,
    description     TEXT NOT NULL,

    enter_date      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date        DATETIME,

    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (technician_id) REFERENCES TECHNICIANS(technician_id)
);