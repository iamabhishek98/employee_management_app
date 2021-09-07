const express = require("express");
const server = express();
const db = require("./db/config");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const PORT = 5001; // put env

const startServer = async () => {
  try {
    db.authenticate()
      .then(() => console.log("Database connected..."))
      .catch((err) => console.log(`DB error: ${err}`));

    server.use(cors());

    const jsonParser = bodyParser.json();
    const upload = multer({ storage: multer.memoryStorage() });

    require("./routes/GET")({ server });
    require("./routes/POST")({ server, jsonParser, upload });
    require("./routes/PATCH")({ server, jsonParser });
    require("./routes/DELETE")({ server });

    server.listen(PORT);

    console.log("App Server running at - http://localhost:%s", PORT);
  } catch (err) {
    console.log("error", err);
  }
};

startServer();
