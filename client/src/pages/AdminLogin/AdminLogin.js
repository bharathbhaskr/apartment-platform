import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);

  useEffect(() => {
    const checkExistingToken = () => {
      const fakeToken = localStorage.getItem('token');
      if (fakeToken) {
        // If the fake token exists, redirect to the admin page
        setRedirectToAdmin(true);
      }
    };

    checkExistingToken();
  }, []); // Empty dependency array ensures it runs only once on mount

  const handleLogin = () => {
    if (username === 'xyz' && password === '123') {
      // Set a token or use your authentication logic here
      const fakeToken = 'fakeToken';
      localStorage.setItem('token', fakeToken);

      // Redirect to the admin page
      setRedirectToAdmin(true);
    } else {
      // Handle invalid credentials
      setError('Invalid username or password');
    }
  };

  if (redirectToAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className='outer-login-container'>
      <div className='login-container'>
        <h2 className='text-center mb-4' id="loginTitle">Admin Login</h2>
        <form>
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <div className='mb-3'>
            <button
              type="button"
              id="loginBox"
              className="btn btn-primary btn-block"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
