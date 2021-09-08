const Sequelize = require("sequelize");

const DATABASE = process.env.NODE_ENV === "test" ? "test_postgres" : "postgres";

module.exports = new Sequelize(
  `postgresql://postgres:postgres@127.0.0.1:5432/${DATABASE}`,
  { logging: false }
);
