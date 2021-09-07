const express = require("express");
const server = express();
const multer = require("multer");
const db = require("./db/config");
const cors = require("cors");

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
      if (file.originalname.slice(file.originalname.length - 4) === ".csv") {
        cb(null, true);
      } else {
        cb("Please upload only csv file!", false);
      }
    };

    const upload = multer({ storage: storage, fileFilter: csvFilter });

    // server.use(function (req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //   res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET",
    //     "PATCH",
    //     "POST",
    //     "DELETE",
    //     "OPTIONS"
    //   );
    //   next();
    // });
    server.use(cors());

    require("./routes/GET")({ server });
    require("./routes/DELETE")({ server });
    require("./routes/POST")({ server, upload });
  } catch (error) {
    console.log("error", error);
  }
};

startServer();
