const Sequelize = require("sequelize");

const DATABASE = process.env.NODE_ENV === "test" ? "test_postgres" : "postgres";

module.exports = new Sequelize(
  `postgresql://postgres:postgres@host.docker.internal:5432/${DATABASE}`,
  { logging: false }
);
