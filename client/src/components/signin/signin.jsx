import React, { useState, useEffect } from "react";
import "../signin/signin.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("/auth/signup", {
        name,
        email,
        password,
      })
      .then(function (response) {
        console.log(response.data);
        // setLoggedInUser(response.data)
        // sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        navigate("/");
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
          <h1>SignUp</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="namebox">
            <label htmlFor="">name</label>

            <input
              className="input"
              id="fname"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <button>SignUp</button>
          </div>
          <div className="footerbox">
            <a href="/">Already have account?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
