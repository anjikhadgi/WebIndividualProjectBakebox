import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'http://localhost:8080/api/customer';

// Function to handle login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

// Function to handle signup (Updated to include fullName and contact)
export const signup = async (full_name, contact_number, username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      full_name,
      contact_number,
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed. Please try again.';
  }
};

// Function to fetch all registered customers (For admin panel)
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/view_customers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch customers.';
  }
};