const Sequelize = require("sequelize");
const Employee = require("../db/models/Employee");
const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { checkValidSalary } = require("../lib/helper");
const { deleteEmployee } = require("../db/queries");

module.exports = ({ server }) => {
  server.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const user = await deleteEmployee(id);

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
