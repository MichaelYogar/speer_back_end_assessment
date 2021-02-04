import React, { Fragment, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  let history = useHistory();

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      console.log(data);
      const response = await axios.post("/auth/login", data);
      console.log(response);
      const token = response.data.jwtToken;
      console.log(token);

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
      <h1 className="mt-5 text-center">Login</h1>
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
          placeholder="password"
          name="password"
          value={password}
          onChange={(e) => onChange(e)}
        />
        <button>Submit</button>
      </form>
    </Fragment>
  );
};

export default Login;
