import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../styles/Dashboard.css";

// Fetch data functions
const fetchTotalCustomers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5000/api/customer/view_customers", { // Port updated
    headers: { Authorization: `Bearer ${token}` }
  });
  // Assuming the customer API returns a direct array or an object with 'customers' array
  if (Array.isArray(response.data)) {
    return response.data.length;
  } else if (response.data.customers && Array.isArray(response.data.customers)) {
    return response.data.customers.length;
  }
  return 0; // Default if not found or invalid
};

const fetchTotalOrders = async () => { // Renamed function
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:5000/api/orders/view_orders", { // Port and endpoint updated
      headers: { Authorization: `Bearer ${token}` },
    });

    // Keep this as it was in the previous fix, assuming orders come in { orders: [...] }
    if (response.data.orders && Array.isArray(response.data.orders)) {
      return response.data.orders.length;
    } else {
      console.error("Received data for orders is not a direct array or expected object format:", response.data);
      return 0; // Return 0 if the data format is not as expected
    }
  } catch (error) {
    console.error("Error fetching total orders:", error);
    return 0; // Return 0 in case of error
  }
};

const fetchTotalProducts = async () => { // Renamed function
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:5000/api/products/view_products", { // Port and endpoint updated
      headers: { Authorization: `Bearer ${token}` }
    });
    // *** MODIFICATION HERE: Check if response.data is directly an array ***
    if (Array.isArray(response.data)) {
      return response.data.length; // If it's an array, return its length
    } else if (response.data.products && Array.isArray(response.data.products)) {
      // This else-if block handles the case where it's an object with a 'products' key.
      // Keeping it here for robustness in case the API sometimes returns this format.
      return response.data.products.length;
    } else {
      console.error("Received data for products is not a direct array or expected object format:", response.data);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching total products:", error);
    return 0;
  }
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

  const { data: totalOrders, isLoading: isLoadingOrders } = useQuery({ // Renamed variable and query key
    queryKey: ["totalOrders"], // Renamed query key
    queryFn: fetchTotalOrders, // Renamed fetch function
    enabled: isAuthenticated,
  });

  const { data: totalProducts, isLoading: isLoadingProducts } = useQuery({ // Renamed variable and query key
    queryKey: ["totalProducts"], // Renamed query key
    queryFn: fetchTotalProducts, // Renamed fetch function
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

  if (isLoadingCustomers || isLoadingOrders || isLoadingProducts) { // Renamed loading states
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="sidebar-title">Admin Panel</h1>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate("/admin/customer")}>Customers</li>
          <li className="menu-item" onClick={() => navigate("/admin/orders")}>Orders</li> {/* Updated navigation path */}
          <li className="menu-item" onClick={() => navigate("/admin/products")}>Products</li> {/* Updated navigation path */}
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
            <h3>Total Orders</h3> {/* Updated display text */}
            <p>{totalOrders}</p> {/* Updated variable */}
          </div>
          <div className="stat-card">
            <h3>Total Products</h3> {/* Updated display text */}
            <p>{totalProducts}</p> {/* Updated variable */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;