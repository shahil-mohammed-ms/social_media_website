import React, { useState, useEffect } from "react";
import "../login/Login.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
console.log('test')

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("/auth/login", {
        email,
        password,
      })
      .then(function (response) {
        navigate("/home");
      })
      .catch(function (error) {
        window.location.reload();
        console.log(error);
      });
  };

  return (
    <div className="main-container">
      <div className="LoginContainer">
        <div className="header">
          <h1>Login</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="emailbox">
            <label htmlFor="">email</label>

            <input
              className="input"
              type="email"
              id="fname"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="passwordbox">
            {" "}
            <label htmlFor="">password</label>
            <input
              className="input"
              type="password"
              id="lname"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
          </div>
          <div className="footerbox">
            <a href="signin">signup</a>

            <a href="">forgot password ?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
