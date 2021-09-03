// Import required module express, fast-csv, multer, mongodb and fs packages
const multer = require("multer");
const csv = require("fast-csv");
// const mongodb = require("mongodb");
const fs = require("fs");
const express = require("express");
const server = express();
const { Client } = require("pg");
const format = require("pg-format");

// Set global directory
global.__basedir = __dirname;

const PORT = 5001; // ||

// Multer Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

// Filter for CSV file
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

const upload = multer({ storage: storage, fileFilter: csvFilter });

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

  console.log("Sent error response:", msg);

  return res.status(500).send({
    message: "Failed to upload CSV data!",
    error: msg,
  });
};

const startServer = async () => {
  try {
    // configure and connect to database
    const dbClient = new Client({
      host: "host.docker.internal",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "postgres",
    });

    await dbClient.connect();
    console.log("Connected to DB");

    server.listen(PORT);
    console.log("App Server running at - http://localhost:%s", PORT);

    // Upload CSV file using Express Rest APIs
    server.post("/users/upload", upload.single("file"), (req, res) => {
      try {
        if (req.file == undefined) {
          return sendUploadResponse(res, 400, "Please upload a CSV file!");
        }

        // Import CSV File to database
        let csvData = [];
        let rowCount = 0;
        let filePath = __basedir + "/uploads/" + req.file.filename;

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
                  throw "Please make sure value entered for salary is properly formatted and valid";
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
                "Please make sure CSV file is not empty"
              );
            }

            // check for some rows with incorrect number of columns
            if (rowCount != csvData.length) {
              return sendUploadResponse(
                res,
                500,
                "Please check if rows have the correct number of columns"
              );
            }

            // Establish connection to the database and start db transaction here
            // check for concurrency (either implement this or reject consequent uploads)
            // make id primary key and make id,login unique
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
                "Rows inserted/updated in DB:",
                insertResult.rowCount
              );

              // send success msg at the end
              return sendUploadResponse(
                res,
                200,
                "Successfully uploaded the CSV data from the file: " +
                  req.file.originalname
              );
            } catch (error) {
              console.log("catch error:", error);

              // Rollback the current transaction
              await dbClient.query("ROLLBACK");

              return sendUploadResponse(
                res,
                500,
                "Unable to insert rows into db"
              );
            }
          });
      } catch (error) {
        console.log("catch error:", error);

        sendUploadResponse(
          res,
          500,
          "Could not upload the file: " + req.file.originalname
        );
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};

startServer();
