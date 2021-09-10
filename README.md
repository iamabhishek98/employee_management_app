# Employee Management App

This is a web application which supports CRUD functionalities to manage employees.

## Tech Stack

1. React
2. Node.js
3. PostgreSQL
4. Docker

## Prerequisites for setting up locally

1. NPM 7
2. Docker
3. Make

## Instructions for setting up locally

1. Either clone the repository or download and extract the zip folder
2. Run `cd employee_management_app` to enter the root directory
3. Run `make build` in the root directory to build the containers
4. Run `make run` in the root directory to run the containers with docker-compose
5. Once the containers are running successfully, the app will be available at http://localhost:3000/

## Instructions for running tests

Note: If running tests for the first time after building containers, some tests might fail due to connection errors to the database container. Please proceed to re-run tests to view the expected results.

1. Make sure that the containers built previously are still up and running
2. Run `cd server` to enter the server directory
3. Run `npm install` in the server directory
4. Run `npm test` to execute the tests
