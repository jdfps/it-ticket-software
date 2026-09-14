drop database if exists TMS;

create database TMS;

use TMS;


create table users(
	user_id int auto_increment primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) unique not null,
    password varchar(255) not null,

	# user can be any of of these roles
    role enum('employee', 'technician', 'admin') not null default 'employee',

    created_at timestamp default current_timestamp
);

create table ticket(
	ticket_id int auto_increment primary key,
    user_id int not null,
    tech_id int not null,
    title varchar(1024) not null,
    description varchar(1024) not null,
    status boolean not null,
    priority int not null,	# integer value 1-30 for how many days it should take to complete
    created_at timestamp default current_timestamp,
    resolved_at timestamp,	# get timestamp when someone completes it
    past_due boolean,
    assigned boolean, 		# if it is assigned it will be 1, and another tech can't grab it.
    
    
    # foreign key from user who posted it
    foreign key (user_id) references users(user_id),
    
    # foreign key to know what tech has grabbed ticket...
    foreign key (tech_id) references users(user_id)
);

create table categories(
	category_id int auto_increment primary key,
    category_name varchar(255) not null
    # don't need description???? because we can just filter with category names?
);

create table comments(
    comment_id int auto_increment primary key,
    ticket_id int not null,
    author_id int not null,
    comment_text varchar(1024) not null,
    created_at timestamp default current_timestamp,

    # which ticket this comment belongs to
    foreign key (ticket_id) references ticket(ticket_id),

    # who posted the comment
    foreign key (author_id) references users(user_id)
);