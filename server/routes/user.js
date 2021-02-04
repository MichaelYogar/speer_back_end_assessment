const express = require("express");
const {
  purchaseStock,
  sellStock,
  deposit,
  getUserInfo,
} = require("../controllers/user");
const router = express.Router();

router.post("/purchaseStock", purchaseStock);
router.post("/sellStock", sellStock);
router.post("/deposit", deposit);
router.post("/getUserInfo", getUserInfo);

module.exports = router;
