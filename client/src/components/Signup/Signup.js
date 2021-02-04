import React, { Fragment, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    username: "",
  });

  let history = useHistory();

  const { email, password, username } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password, username };
      console.log(data);
      const response = await axios.post("/auth/register", data);
      console.log(response);
      const token = response.data.jwtToken;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        setAuth(true);
        history.push("/profile");
        window.location.reload();
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Register</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={(e) => onChange(e)}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="username"
          value={username}
          placeholder="username"
          onChange={(e) => onChange(e)}
        />
        <button>Submit</button>
      </form>
    </Fragment>
  );
};

export default Signup;
