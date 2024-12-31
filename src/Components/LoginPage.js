import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('userRoutes', data.token);
        navigate('/DashboardApp');
      } else {
        setErrorMessage(data.message || 'Invalid username/email or password.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Username or email</label>
            <input
              type="text"
              id="Username"
              name="email"
              placeholder="Enter your username or email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby="usernameHelp"
            />
            <small id="usernameHelp" className="form-text">
              Your registered username or email.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-describedby="passwordHelp"
            />
            <small id="passwordHelp" className="form-text">
              Password must be at least 6 characters.
            </small>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="form-footer">
            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <div className="links">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
              <Link to="/signup" className="create-new">
                Create New Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
