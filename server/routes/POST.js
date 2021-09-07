const csv = require("fast-csv");
const fs = require("fs");
const Employee = require("../models/Employee");
const db = require("../config/database");
const { successHandler, errorHandler } = require("../lib/responseHandlers");
const { checkValidSalary } = require("../lib/helper");

module.exports = ({ server, upload }) => {
  // Upload CSV file using Express Rest APIs
  server.post("/users/upload", upload.single("file"), (req, res) => {
    try {
      if (req.file == undefined) {
        return errorHandler(res, "Please upload a CSV file!");
      }

      // Import CSV File to database
      const filePath = __dirname + "/../uploads/" + req.file.filename;
      let csvData = [];
      let rowCount = 0;

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          return errorHandler(res, error);
        })
        .on("data", (row) => {
          // add checks for csv files here

          // checks if row exists and whether it is a comment
          if (row.id && row.id[0] != "#") {
            rowCount += 1;
            if (row.login && row.name && row.salary) {
              if (!checkValidSalary(row.salary)) {
                throw "Please make sure value entered for salary is properly formatted and valid!";
              }
              csvData.push(row);
            }
          }
        })
        .on("end", async () => {
          // check for empty csv
          if (!rowCount) {
            return errorHandler(res, "Please make sure CSV file is not empty!");
          }

          // check for some rows with incorrect number of columns
          if (rowCount != csvData.length) {
            return errorHandler(
              res,
              "Please check if rows have the correct number of columns!"
            );
          }

          // Establish connection to the database and start db transaction here
          // check for concurrency (either implement this or reject consequent uploads)
          // later test with chinese names to see if varchar works

          const t = await db.transaction();

          try {
            await Employee.bulkCreate(
              csvData,
              {
                fields: ["id", "login", "name", "salary"],
                updateOnDuplicate: ["id", "login", "name", "salary"],
              },
              { transaction: t }
            );

            await t.commit();

            return successHandler(
              res,
              `Successfully uploaded the CSV data from the file: ${req.file.originalname}`
            );
          } catch (error) {
            await t.rollback();
            return errorHandler(res, "Unable to insert rows into db!");
          }
        });
    } catch (error) {
      console.log(`catch error: ${error}`);

      return errorHandler(
        res,
        `Could not upload the file: ${req.file.originalname}!`
      );
    }
  });
};
