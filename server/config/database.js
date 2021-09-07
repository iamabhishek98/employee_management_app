const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// replace these with a url using dot.env later
module.exports = new Sequelize("postgres", "postgres", "postgres", {
  host: "postgres",
  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
