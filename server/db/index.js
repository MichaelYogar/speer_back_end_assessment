const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    define: {
      timestamps: false,
    },
    logging: false, // can turn true for debugging
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection established"))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
