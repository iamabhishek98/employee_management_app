const express = require("express");
const server = express();
const { Client } = require("pg");
const multer = require("multer");

const PORT = 5001; // ||

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

    // Multer Upload Storage
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads/");
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

    require("./routes/POST")({ server, dbClient, upload });
  } catch (error) {
    console.log("error", error);
  }
};

startServer();
