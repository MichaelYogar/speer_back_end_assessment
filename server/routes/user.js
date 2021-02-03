const express = require("express");
const router = express.Router();
const db = require("../db");
const alpha = require("alphavantage")({ key: process.env.API_KEY });

router.post("/purchaseStock", async (req, res) => {
  const { user_name, company, numberOfStocksToPurchase } = req.body;
  console.log(user_name, company, numberOfStocksToPurchase);
  let price;

  // get current balance
  const resultUserBalance = await db.query(
    "SELECT balance FROM users WHERE user_name = $1",
    [user_name]
  );

  const balance = resultUserBalance.rows[0].balance;

  // get price of stock
  // need to use short forms that are listed on NASDAQ
  try {
    const result = await alpha.data.intraday(company);
    const latestRefresh = result["Meta Data"]["3. Last Refreshed"];
    priceString = result["Time Series (1min)"][latestRefresh]["1. open"];
    price = parseInt(priceString);
    // const close = result["Time Series (1min)"][latestRefresh]["4. close"];
  } catch (error) {
    res.send(error);
  }

  // acutal price is the price of the stock * number of stocks to be purchased
  price = price * numberOfStocksToPurchase;
  // check if there is enough money to buy the stock
  if (balance >= price) {
    const newBalance = balance - price;

    // update user balance
    const updatedBalance = await db.query(
      "UPDATE users SET balance = $1 WHERE user_name = $2",
      [newBalance, user_name]
    );

    // update stock count for user
    const checkStock = await db.query(
      "SELECT * FROM stock WHERE company = $1 AND user_name = $2 ",
      [company, user_name]
    );

    // if there is check db if stock already exists
    if (checkStock.rows.length >= 1) {
      const updateStockNum = await db.query(
        "UPDATE stock SET num_of_stocks = num_of_stocks + $1 WHERE user_name = $2 AND company = $3",
        [numberOfStocksToPurchase, user_name, company]
      );
      return res.send("succesful purchase - updated stock total");
    } else {
      // if it doesnt exist, insert the row
      let addedStock = await db.query(
        "INSERT INTO stock (user_name, company, num_of_stocks) VALUES ($1, $2, $3) RETURNING *",
        [user_name, company, numberOfStocksToPurchase]
      );

      return res.send("succesful purchase - inserted row");
    }

    // update db
  } else {
    // not enough, deny trade and return
    return res.status(400).send("Not enough funds to purchase");
  }
});

router.post("/sellStock", async (req, res) => {
  const { user_name, company, numberOfStocksToPurchase } = req.body;
  console.log(user_name, company, numberOfStocksToPurchase);
  let price;

  // get current balance
  const resultUserBalance = await db.query(
    "SELECT balance FROM users WHERE user_name = $1",
    [user_name]
  );

  const balance = resultUserBalance.rows[0].balance;

  // get price of stock
  // need to use short forms that are listed on NASDAQ
  try {
    const result = await alpha.data.intraday(company);
    const latestRefresh = result["Meta Data"]["3. Last Refreshed"];
    priceString = result["Time Series (1min)"][latestRefresh]["1. open"];
    price = parseInt(priceString);
    // const close = result["Time Series (1min)"][latestRefresh]["4. close"];
  } catch (error) {
    res.send(error);
  }

  // acutal price is the price of the stock * number of stocks to be purchased
  price = price * numberOfStocksToPurchase;
  // check if valid price is here
  if (price) {
    const newBalance = balance + price;

    // update user balance
    const updatedBalance = await db.query(
      "UPDATE users SET balance = $1 WHERE user_name = $2",
      [newBalance, user_name]
    );

    // update stock count for user

    // get current number of stocks
    const checkStock = await db.query(
      "SELECT * FROM stock WHERE company = $1 AND user_name = $2 ",
      [company, user_name]
    );

    // if there is check db if stock already exists
    // in this case, stocks should already exist since they're selling existing stocks
    if (checkStock.rows.length >= 1) {
      // subtract current number of stocks with the amount you want to sell
      const updateStockNum = await db.query(
        "UPDATE stock SET num_of_stocks = num_of_stocks - $1 WHERE user_name = $2 AND company = $3",
        [numberOfStocksToPurchase, user_name, company]
      );
      return res.send("succesful sale - updated stock total");
    } else {
      return res
        .status(400)
        .send("Error: Tried to sell stocks that did not exist");
      // // if it doesnt exist, insert the row
      // let addedStock = await db.query(
      //   "INSERT INTO stock (user_name, company, num_of_stocks) VALUES ($1, $2, $3) RETURNING *",
      //   [user_name, company, numberOfStocksToPurchase]
      // );

      // return res.send("succesful purchase - inserted row");
    }

    // update db
  } else {
    // not enough, deny trade and return
    return res.status(400).send("Error occuerd with fetching valid price");
  }
});

router.post("/deposit", async (req, res) => {
  const { user_name, deposit } = req.body;

  const depositBalance = await db.query(
    "UPDATE users SET balance = balance + $1 WHERE user_name = $2",
    [deposit, user_name]
  );

  const newBalance = await db.query(
    "SELECT balance FROM users WHERE user_name = $1",
    [user_name]
  );

  res.send(newBalance.rows[0]);
});

module.exports = router;
