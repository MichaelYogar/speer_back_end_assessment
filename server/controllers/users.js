const db = require("../db");
require("dotenv").config();
const Users = require("../models/users");
const Stocks = require("../models/stocks");
const { sequelize } = require("../models/users");
const alpha = require("alphavantage")({ key: process.env.API_KEY });

module.exports = {
  purchaseStock: async (req, res) => {
    const { user_email, company, num_of_stocks } = req.body;
    let price;

    // get current balance
    const resultUser = await Users.findAll({
      attributes: ["balance"],
      where: {
        user_email: user_email,
      },
    });

    const { balance } = resultUser[0].dataValues;

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
    if (balance >= price * num_of_stocks) {
      const newBalance = balance - price * num_of_stocks;

      // update user balance
      await Users.update({ balance: newBalance }, { where: { user_email } });

      // need to update stock count for user
      const checkStock = await Stocks.findAll({
        where: {
          company,
          user_email,
        },
      });

      // if there is check db if stock already exists
      if (checkStock.length >= 1) {
        await Stocks.update(
          {
            num_of_stocks: sequelize.literal(
              // using literal to update field
              // current number of stocks + number of stocks to be purchased
              `num_of_stocks + ${num_of_stocks}`
            ),
            // updates to the most current price bought
            price,
          },
          { where: { user_email, company } }
        );
        return res.send("succesful purchase - updated stock total");
      } else {
        // if it doesnt exist, insert the row
        await Stocks.create({ user_email, company, num_of_stocks, price });

        return res.send("succesful purchase - inserted row");
      }

      // update db
    } else {
      // not enough, deny trade and return
      return res.status(400).send("Not enough funds to purchase");
    }
  },
  sellStock: async (req, res) => {
    const { user_email, company, num_of_stocks } = req.body;
    let price;

    // get current number of stocks
    const checkStock = await Stocks.findAll({
      attributes: ["num_of_stocks"],
      where: { user_email, company },
    });

    let stockCount = 0;
    if (checkStock.length > 0) {
      stockCount = checkStock[0].num_of_stocks;
    }

    if (stockCount <= 0) {
      return res.status(400).send("Not enough shares to sell");
    }

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
      // get current balance
      const checkBalance = await Users.findAll({
        attributes: ["balance"],
        where: { user_email },
      });

      const balance = checkBalance[0].balance;
      const newBalance = balance + price * num_of_stocks;

      // update stock count for user
      // if there is check db if stock already exists
      // in this case, stocks should already exist since they're selling existing stocks
      if (stockCount >= 1) {
        // currently sequalize not supporting update more than 1 field with natural join
        // refer to https://github.com/sequelize/sequelize/issues/3957

        // subtract current number of stocks with the amount you want to sell
        await Stocks.update(
          {
            num_of_stocks: sequelize.literal(
              // using literal to update field
              // current number of stocks + number of stocks to be purchased
              `num_of_stocks - ${num_of_stocks}`
            ),
          },
          { where: { user_email, company } }
        );

        // and update user balance
        await Users.update(
          { balance: newBalance },
          {
            where: {
              user_email,
            },
          }
        );

        return res.send("succesful sale - updated stock total and balance");
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
    try {
      await Users.update(
        {
          balance: sequelize.literal(
            // using literal to update field
            `balance + ${deposit}`
          ),
        },
        { where: { user_email } }
      );

      res.json(`Deposited ${deposit} dollars to ${user_email}`);
    } catch (err) {
      return res.status(400).send("Error in deposit");
    }
  },
  getUserInfo: async (req, res) => {
    const { user_email } = req.body;
    let arr = [];
    let i = 0;
    console.log(user_email);

    try {
      const resultUser = await Users.findAll({
        attributes: ["balance"],
        where: {
          user_email: user_email,
        },
      });

      const balance = resultUser[0].dataValues;

      // es6
      arr.push(balance);

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
      return res.status(400).send("Error in fetching user info");
    }
  },
};
