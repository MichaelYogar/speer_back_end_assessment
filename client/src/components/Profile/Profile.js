import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import axios from "axios";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Profile = ({ isAuthenticated }) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [deposit, setDeposit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [company, setCompany] = useState("");
  const [numberOfStocks, setNumberOfStocks] = useState(0);

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/deposit", {
        user_email: localStorage.getItem("email"),
        deposit,
      });
      console.log(response);
      setBalance(response.data.balance);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/purchaseStock", {
        user_email: localStorage.getItem("email"),
        company,
        numberOfStocks,
      });
      console.log(response);
      window.location.reload();
    } catch (err) {
      console.log(err.message);
      window.location.reload();
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/sellStock", {
        user_email: localStorage.getItem("email"),
        company,
        numberOfStocks,
      });
      setNumberOfStocks(numberOfStocks);
      console.log(response);
      window.location.reload();
    } catch (err) {
      console.log(err.message);
      window.location.reload();
    }
  };

  useEffect(() => {
    try {
      const getUserInfo = async () => {
        const response = await axios.post("/user/getUserInfo", {
          user_email: localStorage.getItem("email"),
        });
        setBalance(response.data[0].balance);
        // remove first element that contains balance
        response.data.shift();
        setRows(response.data);
        console.log(response.data);
      };

      getUserInfo();
    } catch (err) {
      console.log(err);
    }
  }, [balance]);

  return (
    <>
      <h1>Welcome {localStorage.getItem("email")}</h1>
      <div>
        <h2>Your Current Balance is: {balance ? balance : 0}</h2>
      </div>

      <div>
        <h2 style={{ margin: "0px", paddingTop: "10px" }}>Deposit: </h2>
        <form className={classes.root} noValidate autoComplete="off">
          <Input
            type="number"
            onChange={(e) => setDeposit(e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
          <Button
            onClick={handleDeposit}
            style={{ marginLeft: "5px" }}
            variant="outlined"
            color="primary"
          >
            Deposit
          </Button>
        </form>
      </div>

      <div>
        <form className={classes.root} noValidate autoComplete="off">
          <h2 style={{ margin: "0px", paddingTop: "10px" }}>
            Purchase Shares:
          </h2>
          <TextField
            style={{ marginRight: "5px" }}
            id="standard-basic"
            label="Company"
            onChange={(e) => setCompany(e.target.value)}
          />
          <TextField
            id="standard-basic"
            onChange={(e) => setNumberOfStocks(e.target.value)}
            label="Amount"
          />
          <Button
            type="number"
            style={{ marginLeft: "5px" }}
            variant="outlined"
            color="primary"
            onClick={handlePurchase}
          >
            Purchase
          </Button>
        </form>
      </div>

      <div>
        <form className={classes.root} noValidate autoComplete="off">
          <h2 style={{ margin: "0px", paddingTop: "10px" }}>Sell Shares:</h2>
          <TextField
            style={{ marginRight: "5px" }}
            id="standard-basic"
            label="Company"
            onChange={(e) => setCompany(e.target.value)}
          />
          <TextField
            id="standard-basic"
            onChange={(e) => setNumberOfStocks(e.target.value)}
            label="Amount"
          />
          <Button
            type="number"
            style={{ marginLeft: "5px" }}
            variant="outlined"
            color="primary"
            onClick={handleSell}
          >
            Sell
          </Button>
        </form>
      </div>

      <h2>Portfolio:</h2>

      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">Company</TableCell>
              <TableCell align="right">Shares Owned</TableCell>
              <TableCell align="right">Price Per Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((
              row // rows is an array of objects
            ) => (
              <TableRow key={row.i}>
                <TableCell component="th" scope="row">
                  {row.company}
                </TableCell>
                <TableCell align="right">{row.num_of_stocks}</TableCell>
                <TableCell align="right">${row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Profile;
