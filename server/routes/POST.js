const { successHandler, errorHandler } = require("../lib/ResponseHandlers");
const { upsertMultipleEmployees, insertEmployee } = require("../db/queries");
const { parseCsv } = require("../lib/FileHandlers");
const { checkValidSalary } = require("../lib/ValidationHandlers");

module.exports = ({ server, upload }) => {
  server.post("/users/upload", upload.single("file"), async (req, res) => {
    try {
      if (
        req.file === undefined ||
        req.file.mimetype !== "text/csv" ||
        !req.file.originalname.endsWith(".csv")
      ) {
        throw "Please upload a CSV file!";
      }

      const employees = parseCsv(req.file);

      const upsertEmployeesResponse = await upsertMultipleEmployees(employees);

      if (!upsertEmployeesResponse) {
        throw "Employees could not be created/updated!";
      }

      return successHandler(res, "Successfully created/updated employees!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });

  server.post("/users", async (req, res) => {
    try {
      const { id, login, name, salary } = req.body;

      if (!(id && login && name && salary) || !checkValidSalary(salary)) {
        throw "Invalid body!";
      }

      const insertEmployeeResponse = await insertEmployee(
        id,
        login,
        name,
        salary
      );

      if (!insertEmployeeResponse) {
        throw "Employee could not be created!";
      }

      return successHandler(res, "Employee created!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
