const bcrypt = require("bcrypt");
const db = require("../db");
const createJWT = require("../utils/createJWT");
const Users = require("../models/users");

module.exports = {
  register: async (req, res) => {
    const { email, username, password } = req.body;

    try {
      const result = await Users.findAll({
        where: {
          user_email: email,
        },
      });

      // user already exists, need to use different fields
      if (result.length > 0) {
        return res.status(401).json("User already exist!");
      }
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      // set initial balance for new users to 0
      const initialBalance = 0;

      const createdUser = await Users.create({
        user_name: username,
        user_email: email,
        user_password: bcryptPassword,
        balance: initialBalance,
      });

      console.log("auto-generated ID:", createdUser.user_id);

      const jwtToken = createJWT(createdUser.user_id);

      return res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await Users.findAll({
        where: {
          user_email: email,
        },
      });

      if (result.length === 0) {
        return res.status(401).json("Invalid Credential");
      }

      const dataValues = result[0].dataValues;

      // check password
      const validPassword = await bcrypt.compare(
        password,
        dataValues.user_password
      );

      if (!validPassword) {
        return res.status(401).json("Invalid Credential");
      }
      const jwtToken = createJWT(dataValues.user_id);
      return res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  verify: (req, res) => {
    try {
      // middleware takese care of authorization logic
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};
