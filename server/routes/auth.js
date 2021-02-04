const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const { authorize, validate } = require("../middleware");
const createJWT = require("../utils/createJWT");
const { login, register, verify } = require("../controllers/auth");

// added validate middleware to validate fields before registering
router.post("/register", validate, register);

// added validate middleware to validate fields before login
router.post("/login", validate, login);

// added authorize middleware to protect route
router.post("/verify", authorize, verify);
module.exports = router;
