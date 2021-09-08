const express = require("express");
const server = express();
const db = require("./db/config");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 5001; // put env

try {
  db.authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(`DB error: ${err}`));

  server.use(cors());

  const jsonParser = bodyParser.json();
  const upload = multer({ storage: multer.memoryStorage() });

  require("./routes/GET")({ server: server });
  require("./routes/POST")({ server: server, jsonParser, upload });
  require("./routes/PATCH")({ server: server, jsonParser });
  require("./routes/DELETE")({ server: server });

  if (process.env.NODE_ENV !== "test") {
    server.listen(PORT);
  }

  console.log("App Server running at - http://localhost:%s", PORT);
} catch (err) {
  console.log("error", err);
}

module.exports = server;
