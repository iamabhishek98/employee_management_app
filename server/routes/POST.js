const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { upsertMultipleEmployees } = require("../db/queries");
const multer = require("multer");
const { parseCsv } = require("../lib/fileHandler");

module.exports = ({ server }) => {
  const upload = multer({ storage: multer.memoryStorage() });

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

      const insertEmployees = await upsertMultipleEmployees(employees);

      if (!insertEmployees) {
        throw "Unable to insert rows into db!";
      }

      return successHandler(
        res,
        `Successfully uploaded the CSV data from the file: ${req.file.originalname}`
      );
    } catch (error) {
      return errorHandler(res, error);
    }
  });
};
