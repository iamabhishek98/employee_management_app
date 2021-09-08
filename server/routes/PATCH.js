const { successHandler, errorHandler } = require("../lib/ResponseHandlers");
const { checkValidSalary } = require("../lib/ValidationHandlers");
const { updateEmployee } = require("../db/Queries");

module.exports = ({ server }) => {
  server.patch("/users", async (req, res) => {
    try {
      const { id, login, name, salary } = req.body;

      if (!(id && login && name && salary) || !checkValidSalary(salary)) {
        throw "Invalid body!";
      }

      const updateEmployeeResponse = await updateEmployee(
        id,
        login,
        name,
        salary
      );

      if (!updateEmployeeResponse) {
        throw "Employee could not be updated!";
      }

      if (!updateEmployeeResponse[0]) {
        throw "Employee not found!";
      }

      return successHandler(res, "Employee updated!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
