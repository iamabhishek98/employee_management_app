const Sequelize = require("sequelize");

const DB_HOST = process.env.DB_HOST || "host.docker.internal";

const DB_USER = process.env.DB_USER || "postgres";

const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";

const DB_PORT = process.env.DB_PORT || "5432";

const DB_DATABASE =
  process.env.NODE_ENV === "test" ? "test_postgres" : "postgres";

module.exports = new Sequelize(
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  { logging: false }
);
