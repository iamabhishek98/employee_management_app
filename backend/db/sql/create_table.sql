DROP TABLE IF EXISTS employees;

-- Creation of employees table
CREATE TABLE employees (
    id VARCHAR(250) PRIMARY KEY,
    login VARCHAR(250),
    name VARCHAR(250),
    salary NUMERIC,
    UNIQUE(id, login)
);