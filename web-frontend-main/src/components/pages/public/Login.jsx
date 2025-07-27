import React, { useState } from 'react';
import '../../../styles/Login.css';
import loginImage from '../../../assets/images/login.webp';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { token } = await login(email, password); 
      localStorage.setItem('token', token); // Store token
      toast.success('Login Successful!', { position: 'top-center' });

      setTimeout(() => {
        navigate('/home');
      }, 2000); // Redirect after 2s
    } catch (error) {
      toast.error(error, { position: 'top-center' });
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginImage})` }}>
      <ToastContainer />
      <div className="form-wrapper">
        <div className="form-container">
          <h1>Welcome Back!</h1>
          <h2>Login to Your Account</h2>
          <form className="form-content" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-footer">
              <button type="submit" className="btn-submit">
                Login
              </button>
            </div>
          </form>
          <div className="register-redirect">
            <p>
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
