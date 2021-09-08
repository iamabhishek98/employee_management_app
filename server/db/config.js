const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

const PORT = process.env.NODE_ENV === "test" ? 5433 : 5432;

// replace these with a url using dot.env later
module.exports = new Sequelize(
  `postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres`,
  { logging: false }
);

// postgresql://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_DATABASE}
