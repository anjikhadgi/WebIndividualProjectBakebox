import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [customer, setCustomer] = useState({
    id: '',  // Ensure ID is available for updates
    full_name: '',
    email: '',
    contact_number: ''
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customer/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Profile Data:", data);

      // Set retrieved data into state with correct keys
      setCustomer({
        id: data.id || '',
        full_name: data.full_name || '',
        email: data.email || '',
        contact_number: data.contact_number || ''
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.id) {
      toast.error("Profile ID is missing, update not possible.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/customer/${customer.id}`, customer, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Profile updated successfully");
      console.log("Updated Profile:", response.data);
      
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="full_name" value={customer.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={customer.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contact_number" value={customer.contact_number} onChange={handleChange} required />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
