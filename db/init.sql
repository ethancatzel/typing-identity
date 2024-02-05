create table raw_data (
    id uuid primary key not null default gen_random_uuid(),
    first_name varchar(20) not null,
    char varchar(10) not null,
    timestamp timestamp not null
);

create index idx_raw_data_first_name on raw_data (first_name);

create table leaderboard (
    id uuid primary key not null default gen_random_uuid(),
    first_name varchar(20) not null unique,
    total integer not null default 0,
    count integer not null default 0
);

create index idx_leaderboard_first_name on leaderboard (first_name);
create index idx_leaderboard_total on leaderboard (total);
create index idx_leaderboard_count on leaderboard (count);
