const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const db = require("./db");

const port = 5000 || process.env.PORT;
require("dotenv").config();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ---------- ROUTES ---------- */
app.use(routes);

db.sync()
  .then(() => {
    app.listen(port, console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log("Error: " + err));
