const { Client } = require("pg");
var format = require("pg-format");

const dbClient = new Client({
  host: "host.docker.internal",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "postgres",
});

async function Connect() {
  try {
    await dbClient.connect();
    console.log("Connected to DB");

    // check res.rowCount and compare it to the length of csvArray
  } catch (e) {
    console.log("err", e);
  }
}

Connect();

const insert = async () => {
  try {
    // begin db transaction
    await dbClient.query("BEGINs");

    var values = [
      ["7", "john22", "John Wick", 43235],
      ["6", "testvk", "Vikesh Yadav", 3.2],
    ];
    const res = await dbClient.query(
      format(
        `INSERT INTO employees (id, login, name, salary) 
          VALUES %L
          ON CONFLICT (id) DO UPDATE 
          SET login = excluded.login, 
              name = excluded.name,
              salary = excluded.salary`,
        values
      )
    );
    console.log("rows inserted:", res.rowCount);

    // successfully end the current transaction
    await dbClient.query("COMMIT");
  } catch (error) {
    console.log("err", error);

    // Rollback the current transaction
    await dbClient.query("ROLLBACK");
  }
};

insert();
