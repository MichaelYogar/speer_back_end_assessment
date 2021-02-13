const db = require("../db");
require("dotenv").config();
const User = require("../models/users");
const Stocks = require("../models/stocks");
const alpha = require("alphavantage")({ key: process.env.API_KEY });

module.exports = {
  purchaseStock: async (req, res) => {
    const { user_email, company, numberOfStocks } = req.body;
    console.log(user_email, company, numberOfStocks);
    let price;

    // get current balance
    const resultUserBalance = await db.query(
      "SELECT balance FROM users WHERE user_email = $1",
      [user_email]
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
    // check if there is enough money to buy the stock
    if (balance >= price * numberOfStocks) {
      const newBalance = balance - price * numberOfStocks;

      // update user balance
      const updatedBalance = await db.query(
        "UPDATE users SET balance = $1 WHERE user_email = $2",
        [newBalance, user_email]
      );

      // update stock count for user
      const checkStock = await db.query(
        "SELECT * FROM stock WHERE company = $1 AND user_email = $2 ",
        [company, user_email]
      );

      // if there is check db if stock already exists
      if (checkStock.rows.length >= 1) {
        const updateStockNum = await db.query(
          "UPDATE stock SET num_of_stocks = num_of_stocks + $1, price = $2 WHERE user_email = $3 AND company = $4",
          [numberOfStocks, price, user_email, company]
        );
        return res.send("succesful purchase - updated stock total");
      } else {
        // if it doesnt exist, insert the row
        let addedStock = await db.query(
          "INSERT INTO stock (user_email, company, num_of_stocks, price) VALUES ($1, $2, $3, $4) RETURNING *",
          [user_email, company, numberOfStocks, price]
        );

        return res.send("succesful purchase - inserted row");
      }

      // update db
    } else {
      // not enough, deny trade and return
      return res.status(400).send("Not enough funds to purchase");
    }
  },
  sellStock: async (req, res) => {
    const { user_email, company, numberOfStocks } = req.body;
    console.log(user_email, company, numberOfStocks);
    let price;

    // get current number of stocks
    const checkStock = await db.query(
      "SELECT * FROM stock WHERE company = $1 AND user_email = $2 ",
      [company, user_email]
    );

    let stockCount = 0;
    if (checkStock) {
      stockCount = checkStock.rows[0].num_of_stocks;
    }

    if (stockCount <= 0) {
      res.status(400).send("Not enough shares to sell");
    }

    // get current balance
    const resultUserBalance = await db.query(
      "SELECT balance FROM users WHERE user_email = $1",
      [user_email]
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
    // check if valid price is here
    if (price) {
      const newBalance = balance + price * numberOfStocks;

      // update user balance
      const updatedBalance = await db.query(
        "UPDATE users SET balance = $1 WHERE user_email = $2",
        [newBalance, user_email]
      );

      // update stock count for user

      // if there is check db if stock already exists
      // in this case, stocks should already exist since they're selling existing stocks
      if (stockCount >= 1) {
        // subtract current number of stocks with the amount you want to sell
        const updateStockNum = await db.query(
          "UPDATE stock SET num_of_stocks = num_of_stocks - $1, price = $2 WHERE user_email = $3 AND company = $4",
          [numberOfStocks, price, user_email, company]
        );
        return res.send("succesful sale - updated stock total");
      } else {
        return res
          .status(400)
          .send("Error: Tried to sell stocks that did not exist");
      }

      // update db
    } else {
      // not enough, deny trade and return
      return res.status(400).send("Error occuerd with fetching valid price");
    }
  },
  deposit: async (req, res) => {
    const { user_email, deposit } = req.body;

    const depositBalance = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE user_email = $2",
      [deposit, user_email]
    );

    const newBalance = await db.query(
      "SELECT balance FROM users WHERE user_email = $1",
      [user_email]
    );

    res.send(newBalance.rows[0]);
  },
  getUserInfo: async (req, res) => {
    const { user_email } = req.body;
    let arr = [];
    let i = 0;
    console.log(user_email);

    try {
      const resultUser = await User.findAll({
        where: {
          user_email: user_email,
        },
      });

      const resultUserObj = resultUser[0].dataValues;

      // es6
      arr.push({ balance: resultUserObj.balance });

      const resultStocks = await Stocks.findAll({
        where: {
          user_email: user_email,
        },
      });

      for (const row of resultStocks) {
        arr.push(row);
      }

      res.json(arr);
      // res.send(arr);
    } catch (err) {
      console.log(err);
    }
  },
};
