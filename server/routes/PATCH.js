const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { checkValidSalary } = require("../lib/validationHandlers");
const { updateEmployee } = require("../db/queries");

module.exports = ({ server, jsonParser }) => {
  server.patch("/users", jsonParser, async (req, res) => {
    try {
      const { id, login, name, salary } = req.body;

      if (!(id && login && name && salary) || !checkValidSalary(salary)) {
        throw "Invalid params!";
      }

      const updateEmployeeResponse = await updateEmployee(
        id,
        login,
        name,
        salary
      );

      if (!updateEmployeeResponse[0]) {
        throw "Employee not found!";
      }

      return successHandler(res, "Employee updated!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
