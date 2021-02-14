const { Sequelize } = require("sequelize");
const db = require("../db");

const Users = db.define("users", {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Users;
