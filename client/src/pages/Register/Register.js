import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import "./Register.css";
import AuthService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [usernameValid, setUsernameValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [redirectToHousehold, setRedirectToHousehold] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setRedirectToDashboard(true);
      }
    };

    checkExistingToken();
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      //Send api request
      const result = await AuthService.register({ username, email, password });

      if (result && result.message) {
        // alert user
        console.log("RESULT MESSAGE", result.message);
      }

      if (result) {
        navigate("/householdSelection");
        setRedirectToHousehold(true);
      }

      //Redirect
      //setRedirectToLogin(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    // Implement your email validation logic here
    const isValid = AuthService.validateEmail(email);
    setEmailValid(isValid);

    if (isValid) {
      setEmail(email);
    }
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    // Implement your username validation logic here
    const isValid = AuthService.validateUsername(username);
    setUsernameValid(isValid);

    if (isValid) {
      setUsername(username);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    // Implement your password validation logic here
    const isValid = AuthService.validatePassword(password);
    setPasswordValid(isValid);

    if (isValid) {
      setPassword(password);
    }
  };

  const calculateProgress = () => {
    // You can adjust the weight of each field based on your form structure
    const totalFields = 3; // Assuming you have 3 form fields

    const completedFields = [emailValid, usernameValid, passwordValid].filter(
      (isValid) => isValid
    ).length;

    const newProgress = (completedFields / totalFields) * 100;

    let progressText = "Let's go";

    if (newProgress >= 35) {
      progressText = "There's no stopping now";
    }

    if (newProgress >= 69) {
      progressText = "Almost there";
    }

    setProgress(newProgress);
    setProgressText(progressText);
  };

  const [progressText, setProgressText] = useState("Let's go");

  useEffect(() => {
    calculateProgress();
  }, [emailValid, usernameValid, passwordValid]);

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  if (redirectToHousehold) {
    return <Navigate to="/householdSelection" />;
  }

  if (redirectToDashboard) {
    return <Navigate to="/userDashboard" />;
  }

  return (
    <div className="reg-container">
      {/* Signup Form Section */}
      <div className="form-container col-sm-12 col-md-6">
        <form id="signupForm">
          {/* ... (other form groups) */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${
                emailValid === true
                  ? "is-valid"
                  : emailValid === false
                  ? "is-invalid"
                  : ""
              }`}
              id="email"
              name="email"
              required
              onChange={handleEmailChange}
            />
            {emailValid === false && (
              <div className="invalid-feedback">Invalid</div>
            )}
            {emailValid === true && (
              <div className="valid-feedback">Perfect!</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className={`form-control ${
                usernameValid === true
                  ? "is-valid"
                  : usernameValid === false
                  ? "is-invalid"
                  : ""
              }`}
              id="username"
              name="username"
              required
              onChange={handleUsernameChange}
            />
            {usernameValid === false && (
              <div className="invalid-feedback">
                Invalid
                <br />
                <span className="badge badge-warning" id="usernameWarning">
                  At least 3 alphabets or digits
                </span>
              </div>
            )}
            {usernameValid === true && (
              <div className="valid-feedback">Perfect!</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${
                passwordValid === true
                  ? "is-valid"
                  : passwordValid === false
                  ? "is-invalid"
                  : ""
              }`}
              id="password"
              name="password"
              required
              onChange={handlePasswordChange}
            />
            {passwordValid === false && (
              <div className="invalid-feedback">
                Invalid
                <br />
                <span className="badge badge-warning" id="usernameWarning">
                  At least 8 characters, at least one uppercase letter<br></br>
                  one lowercase letter, and one digit
                </span>
              </div>
            )}
            {passwordValid === true && (
              <div className="valid-feedback">Perfect!</div>
            )}
          </div>
          {/* ... (similar conversion for other form groups) */}
          <div className="progress mb-3">
            <div
              className="progress-bar"
              id="progressBar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span id="progressBarText">{progressText}</span>
            </div>
          </div>
          <div className="centered-button">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRegister}
              id="signupButton"
              disabled={!(passwordValid && emailValid && usernameValid)}
            >
              Sign Up
            </button>
            <br />
            <br />
            <Link to="/login">Already an Amigo? Login here</Link>
          </div>
        </form>
      </div>

      {/* Image with Text Overlay */}
      <div className="col-sm-12 col-md-6 image-container">
        <img
          src={require("../../assets/images/signup-bg.png")}
          alt="Background Image"
          className="img-fluid image"
        />
        <div className="text-overlay text-center">
          <p className="h2">APARTMENT AMIGO</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
