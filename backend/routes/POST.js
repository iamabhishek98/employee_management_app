// Import required module express, fast-csv, multer, mongodb and fs packages
const csv = require("fast-csv");
const format = require("pg-format");
const fs = require("fs");

// helper functions
const checkValidSalary = (str) => {
  if (isNaN(str)) return false;
  const decimal = parseFloat(str);
  return decimal !== false && decimal > 0;
};

const sendUploadResponse = (res, statusCode, msg) => {
  if (statusCode != 500) {
    return res.status(statusCode).send({
      message: msg,
    });
  }

  console.log(`Sent error response: ${msg}`);

  return res.status(500).send({
    message: "Failed to upload CSV data!",
    error: msg,
  });
};

module.exports = async ({ server, dbClient, upload }) => {
  // Upload CSV file using Express Rest APIs
  server.post("/users/upload", upload.single("file"), (req, res) => {
    try {
      if (req.file == undefined) {
        return sendUploadResponse(res, 400, "Please upload a CSV file!");
      }

      // Import CSV File to database
      const filePath = __dirname + "/../uploads/" + req.file.filename;
      let csvData = [];
      let rowCount = 0;

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          return sendUploadResponse(res, 500, error);
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
              csvData.push([
                row.id,
                row.login,
                row.name,
                parseFloat(row.salary),
              ]);
            }
          }
        })
        .on("end", async () => {
          // check for empty csv
          if (!rowCount) {
            return sendUploadResponse(
              res,
              500,
              "Please make sure CSV file is not empty!"
            );
          }

          // check for some rows with incorrect number of columns
          if (rowCount != csvData.length) {
            return sendUploadResponse(
              res,
              500,
              "Please check if rows have the correct number of columns!"
            );
          }

          // Establish connection to the database and start db transaction here
          // check for concurrency (either implement this or reject consequent uploads)
          // later test with chinese names to see if varchar works
          try {
            await dbClient.query("BEGIN");

            const insertResult = await dbClient.query(
              format(
                `INSERT INTO employees (id, login, name, salary) 
                    VALUES %L
                    ON CONFLICT (id) DO UPDATE 
                    SET login = excluded.login, 
                        name = excluded.name,
                        salary = excluded.salary`,
                csvData
              )
            );

            // successfully end the current transaction
            await dbClient.query("COMMIT");

            console.log(
              `Rows inserted/updated in DB: ${insertResult.rowCount}`
            );

            // send success msg at the end
            return sendUploadResponse(
              res,
              200,
              `Successfully uploaded the CSV data from the file: ${req.file.originalname}`
            );
          } catch (error) {
            console.log(`catch error: ${error}`);

            // Rollback the current transaction
            await dbClient.query("ROLLBACK");

            return sendUploadResponse(
              res,
              500,
              "Unable to insert rows into db!"
            );
          }
        });
    } catch (error) {
      console.log(`catch error: ${error}`);

      sendUploadResponse(
        res,
        500,
        `Could not upload the file: ${req.file.originalname}!`
      );
    }
  });
};
