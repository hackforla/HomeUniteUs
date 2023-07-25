CREATE SCHEMA huu;

CREATE TABLE huu.guests
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE huu.guest_applications
(
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES huu.guests (id),
    app_and_onb_tasks VARCHAR(50) NOT NULL,
    host_selec_tasks VARCHAR(50) NOT NULL,
    match_tasks VARCHAR(50) NOT NULL
);

-- manually write query to output the result we need from this endpoint
SELECT
    id AS application_id,
    guest_id,
    app_and_onb_tasks,
    host_selec_tasks,
    match_tasks
FROM huu.guest_applications
WHERE guest_id = {id}
;

-- DROP SCHEMA huu CASCADE