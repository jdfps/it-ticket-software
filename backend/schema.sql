drop database if exists TMS;

create database TMS;

use TMS;


create table users(
    user_id int auto_increment primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) unique not null,
    password varchar(255) not null,

    # user can be any of these roles
    role enum('employee', 'technician', 'admin') not null default 'employee',

    created_at timestamp default current_timestamp
);


create table categories(
    category_id int auto_increment primary key,
    category_name varchar(255) unique not null
);


create table ticket(
    ticket_id int auto_increment primary key,

    # user who created the ticket
    user_id int not null,

    # technician assigned to the ticket
    # can be NULL because a new ticket may not have a technician yet
    tech_id int,

    # category that this ticket belongs to
    category_id int not null,

    title varchar(1024) not null,
    description varchar(1024) not null,

    # current state of the ticket
    status enum('open', 'in_progress', 'resolved', 'closed')
        not null default 'open',

    # integer value 1-30 for how many days it should take to complete
    priority int not null,

    created_at timestamp default current_timestamp,

    # date the ticket should be completed by
    due_date datetime,

    # gets timestamp when ticket is resolved
    resolved_at timestamp null,


    # foreign key for the user who posted the ticket
    foreign key (user_id) references users(user_id),

    # foreign key for the technician assigned to the ticket
    # tech_id references a user whose role should be 'technician'
    foreign key (tech_id) references users(user_id),

    # foreign key for the category this ticket belongs to
    foreign key (category_id) references categories(category_id)
);


create table comments(
    comment_id int auto_increment primary key,

    # ticket that this comment was posted on
    ticket_id int not null,

    # user who posted the comment
    # can be employee, technician, or admin
    author_id int not null,

    comment_text varchar(1024) not null,
    created_at timestamp default current_timestamp,


    # foreign key for which ticket this comment belongs to
    foreign key (ticket_id) references ticket(ticket_id),

    # foreign key for the user who posted the comment
    foreign key (author_id) references users(user_id)
);