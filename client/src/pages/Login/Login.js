import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Set to true initially
  const [error, setError] = useState(null);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [redirectToHousehold, setRedirectToHousehold] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await AuthService.login({ username, password });

      if (result && result.token) {
        // Login successful, redirect to the user dashboard
        console.log("Here is the user", result.user)
        console.log("print statement ",  result.user.household==null);
        if (result.user.household == null){
          console.log("here")
          setRedirectToHousehold(true);
          
        } else {
          setRedirectToDashboard(true);
        }

      } else {
        // Handle login failure
        setError('Invalid username or password');
      }
    } catch (error) {
      // Handle errors
      setError('An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem('token');
      // if (token) {
      //   try{
      //     const userInfo = AuthService.getUserInfo();
      //   }
      //   // Redirect to userDashboard if a token exists
      //   setRedirectToDashboard(true);
      // }

      if (token){
        setRedirectToDashboard(true);
      }
      setIsLoading(false); // Set loading to false after the check
    };

    checkExistingToken();
  }, []); // Empty dependency array ensures it runs only once on mount

  if (isLoading) {
    // Render loading indicator or message while checking for the token
    return <p>Loading...</p>;
  }

  if (redirectToHousehold) {
    return <Navigate to="/householdSelection" />;
  }

  if (redirectToDashboard) {
    return <Navigate to="/userDashboard" />;
  }

  return (
    <div className='outer-login-container'>
    <div className='login-container'>
      <h2 className='text-center mb-4' id="loginTitle">Login</h2>
      <form>
        <div className='loginmb mb-3'>
        <label htmlFor='username' className='form-label'>
          Username
          </label>
          <input type="text" className="form-control" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
      <div className='loginmb mb-3'>
        <label htmlFor="password" className="form-label">
          Password
        </label>
          <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <br></br>
      <div className='loginmb mb-3' >
        <button type="button" id="loginBox" className="btn btn-primary btn-block" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      </form>

      <div className='mt-3 text-center'>
        <Link to="/register" className='signUpButton'>Sign Up</Link>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
};



export default Login;
