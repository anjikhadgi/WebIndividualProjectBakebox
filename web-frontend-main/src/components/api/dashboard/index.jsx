import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../styles/Dashboard.css";

// Fetch data functions
const fetchTotalCustomers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:8080/api/customer/view_customers", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.length;
};

const fetchTotalBookings = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:8080/api/booking/view_bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Log the response to check its structure (debugging step)
    console.log('Bookings API Response:', response.data);

    // Ensure the bookings data is accessible under 'response.data.bookings'
    if (response.data && Array.isArray(response.data.bookings)) {
      return response.data.bookings.length; // Return the length of the bookings array
    } else {
      return 0; // Return 0 if the data format is not as expected
    }
  } catch (error) {
    console.error("Error fetching total bookings:", error);
    return 0; // Return 0 in case of error
  }
};




const fetchTotalDesigns = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:8080/api/design/view_design", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.length;
};

function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login"); // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true); // Set authentication state
    }
  }, [navigate]);

  // Fetch data only if authenticated
  const { data: totalCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["totalCustomers"],
    queryFn: fetchTotalCustomers,
    enabled: isAuthenticated,
  });

  const { data: totalBookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["totalBookings"],
    queryFn: fetchTotalBookings,
    enabled: isAuthenticated,
  });

  const { data: totalDesigns, isLoading: isLoadingDesigns } = useQuery({
    queryKey: ["totalDesigns"],
    queryFn: fetchTotalDesigns,
    enabled: isAuthenticated,
  });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  // Prevent unauthorized rendering
  if (!isAuthenticated) {
    return null; // Prevents unauthorized users from even seeing the UI
  }

  if (isLoadingCustomers || isLoadingBookings || isLoadingDesigns) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="sidebar-title">Admin Panel</h1>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate("/admin/customer")}>Customers</li>
          <li className="menu-item" onClick={() => navigate("/admin/booking")}>Bookings</li>
          <li className="menu-item" onClick={() => navigate("/admin/design")}>Designs</li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1 className="welcome-message">Welcome to the Admin Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>{totalCustomers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{totalBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Total Designs</h3>
            <p>{totalDesigns}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
