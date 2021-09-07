const Sequelize = require("sequelize");
const db = require("../config");

const Employee = db.define(
  "employee",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    salary: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Employee.sync().then(() => {
  console.log("Employee table synced!");
});

module.exports = Employee;
