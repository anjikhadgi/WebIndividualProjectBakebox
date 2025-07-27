import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';  
import '../../../styles/Navbar.css';
import { FaUser } from "react-icons/fa";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'logout-toast', // Add custom class for logout toast
      });
      navigate("/login"); // Navigate to login page after logout
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="navelement">
        <div className="home"><Link to="/home">Home</Link></div>
        <div className="book"><Link to ="/bookconsultation">Book</Link></div>

        {/* Show profile options based on authentication */}
        {isAuthenticated ? (
          <div className="profile" 
            onMouseEnter={() => setShowDropdown(true)} 
            onMouseLeave={() => setShowDropdown(false)}
          >
            <FaUser />
            {showDropdown && (
              <div className="drop-down">
                <Link to="/profile">Profile</Link>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;