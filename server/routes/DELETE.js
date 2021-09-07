const Sequelize = require("sequelize");
const Employee = require("../models/Employee");
const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { checkValidSalary } = require("../lib/helper");

module.exports = ({ server }) => {
  server.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Employee.destroy({ where: { id: id }, raw: true });

      if (!user) {
        errorHandler(res, "User not found!");
      } else {
        successHandler(res, "User deleted!");
      }
    } catch (error) {
      console.log(`catch error: ${error}`);
    }
  });
};
