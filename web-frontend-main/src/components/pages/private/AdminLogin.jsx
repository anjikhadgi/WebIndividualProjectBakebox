import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../../styles/AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", credentials);
      console.log("API Response:", res.data); // Debugging
      if (res.data.token) {
        localStorage.setItem("token", res.data.token); // Store token
        navigate("/admin/dashboard"); // Redirect to dashboard
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid username or password");
    }
  };
  

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="admin-login-input" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="admin-login-input" />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="admin-login-button">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
