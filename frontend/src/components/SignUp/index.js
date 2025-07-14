import { Component } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

// Client --> Server Communication

// Post {
//     method: post
//     authorization: Beare Jwt_token
// }

// Signup:
// Create Account
// USer Name
// New Password

// Login:
// username:
// password:

// Sigup (SQL DB, MongoDB) -
// // Authentcation -- Verifying user identity
// // Authorization -- Verifying user is permitted to access few items - Admin, Read, View, Amend
// ---> Prime Customers, VPN
// // JWT - JS Web token
// // Cookies -- Client Side Storage Mech

import "./index.css";

class SignUp extends Component {
  state = {
    username: "",
    password: "",
    showSubmitError: false,
    errorMsg: "",
  };

  // Updating phase
  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  // On Success response
  onSubmitSuccess = (jwtToken) => {
    const { history } = this.props;
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
      path: "/", // make it available to all routes
    });
    history.replace("/"); // this will redirect to home
  };

  // Response Failure due to Wrong Password
  onSubmitFailure = (errorMsg) => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const userDetails = { username, password };
    const url = "http://localhost:5000/api/auth/signup"; // ✅ backend route
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      this.onSubmitSuccess(data.token); // ✅ backend returns "token"
    } else {
      this.onSubmitFailure(data.message); // ✅ error message from backend
    }
  };

  // Check Username
  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    );
  };

  // Check Password
  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  render() {
    const { showSubmitError, errorMsg } = this.state;
    const jwtToken = Cookies.get("jwt_token");

    // When authiticated user tries to access login route, Navigate them to Home Route
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            SignUp
          </button>
          {/* To Display error Ms */}
          {showSubmitError && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    );
  }
}

export default SignUp;
