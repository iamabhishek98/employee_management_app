const { successHandler, errorHandler } = require("../lib/response_utility");
const { checkValidSalary } = require("../lib/validation_utility");
const { fetchEmployee, fetchMultipleEmployees } = require("../db/queries");

module.exports = ({ server }) => {
  server.get("/users", async (req, res) => {
    try {
      const { minSalary, maxSalary, offset, limit, sort } = req.query;
      if (!(minSalary && maxSalary && offset && limit && sort)) {
        throw "Missing required request params!";
      }

      if (
        !(checkValidSalary(minSalary) && checkValidSalary(minSalary)) ||
        minSalary > maxSalary
      ) {
        throw "Invalid salary range values!";
      }

      if (isNaN(offset) || offset < 0) {
        throw "Invalid offset value!";
      }

      if (isNaN(limit) || limit < 0 || limit > 30) {
        throw "Invalid limit value!";
      }

      if (
        !(
          sort.length > 2 &&
          (sort[0] === " " || sort[0] === "-") &&
          ["id", "login", "name", "salary"].includes(sort.substring(1))
        )
      ) {
        throw "Invalid sort params!";
      }

      const sortOrder = sort[0] === "-" ? "DESC" : "ASC";
      const sortColumn = sort.substring(1);

      const results = await fetchMultipleEmployees(
        minSalary,
        maxSalary,
        sortColumn,
        sortOrder,
        limit,
        offset
      );

      return successHandler(res, results);
    } catch (err) {
      return errorHandler(res, err);
    }
  });

  server.get("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const employee = await fetchEmployee(id);

      if (!employee) {
        throw "Employee not found!";
      }

      return successHandler(res, employee);
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
