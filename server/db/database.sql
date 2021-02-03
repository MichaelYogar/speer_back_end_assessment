-- create database if haven't already

CREATE TABLE users(
  user_id SERIAL NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  balance INTEGER NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE stock(
  stock_id SERIAL NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  num_of_stocks INTEGER NOT NULL,
  PRIMARY KEY(stock_id)
);