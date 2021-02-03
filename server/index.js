const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const cors = require("cors");

const port = 5000 || process.env.PORT;
require("dotenv").config();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ---------- ROUTES ---------- */
app.use(routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
