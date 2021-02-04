import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/NavBar/Navbar";
import axios from "axios";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

function App() {
  // keeps track if users have been authenticated. Helps protect routes using JWT
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  useEffect(() => {
    const checkAuthenticated = async () => {
      const token = localStorage.token;
      try {
        const response = await axios.post("/auth/verify", {
          headers: {
            jwt_token: token,
          },
        });
        if (response.data !== true) {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    checkAuthenticated();
  }, []);

  return (
    <div className="App">
      <Layout>
        <Router>
          <NavBar isAuthenticated={isAuthenticated} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setAuth={setAuth} />}
          />
          <Route
            exact
            path="/signup"
            render={(props) => <Signup {...props} setAuth={setAuth} />}
          />
          <Route
            exact
            path="/profile"
            render={(props) =>
              !isAuthenticated ? (
                <Profile {...props} isAuthenticated={isAuthenticated} />
              ) : (
                <Redirect to="/profile" />
              )
            }
          />
        </Router>
      </Layout>
    </div>
  );
}

export default App;
