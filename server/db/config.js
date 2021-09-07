const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// replace these with a url using dot.env later
module.exports = new Sequelize(
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
  {}
);

// postgresql://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_DATABASE}
