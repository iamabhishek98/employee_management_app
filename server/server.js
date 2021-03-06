const express = require("express");
const server = express();
const db = require("./db/config");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

try {
  db.authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) => {
      console.log(`DB error: ${err}`);
      process.exit(1);
    });

  server.use(cors());
  server.use(bodyParser.json());

  const upload = multer({ storage: multer.memoryStorage() });

  require("./routes/GET")({ server });
  require("./routes/POST")({ server, upload });
  require("./routes/PATCH")({ server });
  require("./routes/DELETE")({ server });

  if (process.env.NODE_ENV !== "test") {
    server.listen(PORT);
    console.log(`Server running on port ${PORT}...`);
  }
} catch (err) {
  console.log("error:", err);
}

module.exports = server;
