create table raw_data (
    id uuid primary key not null default gen_random_uuid(),
    first_name varchar(20) not null,
    char varchar(10) not null,
    timestamp timestamp not null
);
