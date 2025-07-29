import React, { useEffect, useState } from "react"; // Import useEffect and useState from React
import { useNavigate } from "react-router-dom"; // For navigation
import '../../../styles/OrderStyles.css' // Updated import path for styles

function OrderIndex() { // Renamed component function
  const [orders, setOrders] = useState([]); // Renamed state variable
  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchOrders = async () => { // Renamed fetch function
    try {
      const response = await fetch("http://localhost:5000/api/orders/view_orders", { // Updated port and endpoint
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders"); // Updated message

      const data = await response.json();

      // Check if 'orders' exists and is an array (API might return { orders: [...] })
      // Based on previous changes, controller for findAll might return direct array
      if (Array.isArray(data)) { // Check if data is directly an array
        setOrders(data);
      } else if (data.orders && Array.isArray(data.orders)) { // Fallback if it's still wrapped
        setOrders(data.orders);
      } else {
        console.error("Received data.orders is not an array:", data); // Updated message
        setOrders([]); // If data is not valid, set an empty array
      }
    } catch (error) {
      console.error("Error fetching orders:", error); // Updated message
      setOrders([]); // Set to empty array if there is an error
    }
  };

  const handleDeleteOrder = async (orderId) => { // Renamed delete function and parameter
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/orders/${orderId}`, // Updated port and endpoint
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // On success, refetch the orders to update the list
        fetchOrders(); // Call updated fetch function
      } else {
        console.error("Failed to delete order"); // Updated message
      }
    } catch (error) {
      console.error("Error deleting order:", error); // Updated message
    }
  };

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard"); // Navigate back to the dashboard
  };

  useEffect(() => {
    fetchOrders(); // Call updated fetch function
  }, []);

  return (
    <div className="admin-orders"> {/* Updated class name */}
      <button className="back-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      <h2>Order Requests</h2> {/* Updated heading */}
      <table className="orders-table"> {/* Updated class name */}
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Quantity</th>
            <th>Product</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? ( // Updated state variable
            orders.map((order) => ( // Updated map variable
              <tr key={order.id}>
                <td>{order.full_name}</td>
                <td>{order.contact_number}</td>
                <td>{order.email}</td>
                <td>{order.quantity || "N/A"}</td> {/* Consistent with Order model field */}
                <td>{order.product_name || "N/A"}</td> {/* Consistent with Order model field */}
                <td>{new Date(order.order_date).toLocaleDateString()}</td> {/* Consistent with Order model field */}
                <td>{order.description}</td>
                <td>
                  <button
                    onClick={() => handleDeleteOrder(order.id)} // Updated function call
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders available</td> {/* Updated message */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderIndex; // Export renamed component