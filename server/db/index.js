const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  host: process.env.PG_HOST,
  port: 5432 || process.env.PG_PORT,
  database: process.env.PG_DB,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  } else {
    return console.log("Connected to db");
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
