import React, { useState } from 'react';
import '../../../styles/Signup.css';
import signupImage from '../../../assets/images/signup.PNG';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/api'; // Import signup function
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName || !contact || !username || !email || !password || !confirmPassword) {
      toast.error('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const response = await signup(fullName, contact, username, email, password);
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        toast.success('Account created successfully!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(response?.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
        <img src={signupImage} alt="Signup" />
      </div>
      <div className="sign-up">
        <h1>Sign up</h1>
        <p>Create your account</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            id="full-name"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            id="contact"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            id="user-email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignupPage;
