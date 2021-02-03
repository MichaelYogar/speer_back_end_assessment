const express = require("express");
const { purchaseStock, sellStock, deposit } = require("../controllers/user");
const router = express.Router();

router.post("/purchaseStock", purchaseStock);
router.post("/sellStock", sellStock);
router.post("/deposit", deposit);

module.exports = router;
