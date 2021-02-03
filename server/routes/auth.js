const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const { authorize, validate } = require("../middleware");
const createJWT = require("../utils/createJWT");

// added validate middleware to validate fields before registering
router.post("/register", validate, async (req, res) => {
  const { email, username, password } = req.body;

  // create table if it doesn't exist because it's essential for user registration
  try {
    const resultingTable = await db.query(
      "CREATE TABLE IF NOT EXISTS users( \
      user_id SERIAL,\
      user_name VARCHAR(255) NOT NULL,\
      user_email VARCHAR(255) NOT NULL UNIQUE,\
      user_password VARCHAR(255) NOT NULL,\
      PRIMARY KEY(user_id)\
    )"
    );
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    // user already exists, need to use different fields
    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    // set initial balance for new users to 0
    const initialBalance = 0;

    // returns the values of any columns after the insert or update was run
    let newUser = await db.query(
      "INSERT INTO users (user_name, user_email, user_password, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, bcryptPassword, initialBalance]
    );

    const jwtToken = createJWT(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// added validate middleware to validate fields before login
router.post("/login", validate, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    // check password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = createJWT(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// added authorize middleware to protect route
router.post("/verify", authorize, (req, res) => {
  try {
    // middleware takese care of authorization logic
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
