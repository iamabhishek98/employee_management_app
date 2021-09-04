const express = require("express");
const server = express();
const multer = require("multer");
const db = require("./config/database");

const PORT = 5001; // put env

const startServer = async () => {
  try {
    db.authenticate()
      .then(() => console.log("Database connected..."))
      .catch((err) => console.log("Error: " + err));

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

    require("./routes/GET")({ server });
    require("./routes/POST")({ server, upload });
  } catch (error) {
    console.log("error", error);
  }
};

startServer();
