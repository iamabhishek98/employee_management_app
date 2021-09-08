const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { upsertMultipleEmployees, insertEmployee } = require("../db/queries");
const { parseCsv } = require("../lib/fileHandlers");
const { checkValidSalary } = require("../lib/validationHandlers");

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
        throw "Unable to insert rows into db!";
      }

      return successHandler(
        res,
        `Successfully uploaded the CSV data from the file: ${req.file.originalname}`
      );
    } catch (err) {
      return errorHandler(res, err);
    }
  });

  server.post("/users", async (req, res) => {
    try {
      const { id, login, name, salary } = req.body;

      if (!(id && login && name && salary) || !checkValidSalary(salary)) {
        throw "Invalid params!";
      }

      await insertEmployee(id, login, name, salary);

      return successHandler(res, "Employee created!");
    } catch (err) {
      return errorHandler(res, err);
    }
  });
};
