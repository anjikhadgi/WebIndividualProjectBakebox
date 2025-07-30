import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "../../../styles/OrderConsultation.css"; // Updated stylesheet import
import orderConsult from "../../../assets/images/bookConsult.avif"; // Image asset name remains the same

function OrderConsultation() { // Renamed component function
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    quantity: 0, 
    product: "", 
    order_date: "", // Renamed from 'date' to match backend Order model
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const createOrder = useMutation({ // Renamed mutation hook
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");

      // Map frontend formData to backend Order model fields
      const orderData = { // Renamed from bookingData
        full_name: data.full_name,
        contact_number: data.contact_number,
        email: data.email,
        quantity: data.quantity, // Mapped from frontend 'quantity'
        product_name: data.product, // Mapped from frontend 'product'
        order_date: data.order_date, // Mapped from frontend 'order_date'
        description: data.description,
      };

      return axios.post("http://localhost:5000/api/orders/create_order", orderData, { // Port and endpoint updated
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      alert("✅ Order successful!"); // Updated message
      setFormData({ // Reset form to initial state
        full_name: "",
        contact_number: "",
        email: "",
        quantity: 0,
        product: "",
        order_date: "",
        description: "",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      alert(`❌ Order failed: ${error.response?.data?.message || "Unknown error"}`); // Updated message
      setIsLoading(false);
    },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For number inputs, parse value to a number
    const newValue = type === 'number' ? parseFloat(value) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedDate = new Date(formData.order_date); // Using order_date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);

    if (selectedDate < today) {
      alert("⚠️ Cannot order a past date!");
      setIsLoading(false);
      return;
    }

    if (selectedDate > maxDate) {
      alert("⚠️ Cannot order more than a year in advance!");
      setIsLoading(false);
      return;
    }

    // Ensure both quantity and product are selected/entered
    if (formData.quantity <= 0 || !formData.product) { // Updated validation
      alert("⚠️ Quantity must be greater than 0 and Product must be selected!"); // Updated message
      setIsLoading(false);
      return;
    }

    createOrder.mutate(formData); // Call updated mutation
  };

  return (
    <div className="orderWrapper"> {/* Renamed class name */}
      <div className="bg-image" style={{ backgroundImage: `url(${orderConsult})` }}>
        <div className="order-header"> {/* Renamed class name */}
          <h1>Tell us your Taste</h1>
          <h2>So we can help to make your flavour.</h2>
        </div>
        <div className="orderContent"> {/* Renamed class name */}
          <form className="consultForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name:</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Contact:</label>
              <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Quantity:</label> {/* Updated label */}
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" /> {/* Changed to number input */}
            </div>

            <div className="form-group">
              <label>Select by Product:</label> {/* Updated label */}
              <select name="product" value={formData.product} onChange={handleChange} required> {/* Renamed name */}
                <option value="">Select Product</option> {/* Updated option */}
                <option value="Pastry">Pastry</option>
                <option value="Muffins">Muffins</option>
                <option value="Donuts">Donuts</option>
                <option value="Cookies">Cookies</option>
                <option value="Cakes">Cakes</option>
                <option value="Breads">Breads</option>
                <option value="Pies">Pies</option>
                <option value="Brownies">Brownies</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Chocolate Cake">Chocolate Cake</option>
                <option value="Cheesecake">Cheesecake</option>
                <option value="Butter-Scotch Cake">Butter-Scotch Cake</option>
                <option value="Red Velvet Cake">Red Velvet Cake</option>
                <option value="Fruit Cake">Fruit Cake</option>
                <option value="Vanilla Cake">Vanilla Cake</option>
                <option value="Carrot Cake">Carrot Cake</option>
                <option value="Lemon Cake">Lemon Cake</option>
                <option value="Pineapple Cake">Pineapple Cake</option>
                <option value="Black Forest Cake">Black Forest Cake</option>
                <option value="Strawberry Cake">Strawberry Cake</option>
                <option value="Coffee Cake">Coffee Cake</option>
                
                
              </select>
            </div>

            <div className="form-group">
              <label>Select Date:</label>
              <input type="date" name="order_date" value={formData.order_date} onChange={handleChange} required /> {/* Renamed name */}
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your preferences, themes, or any details."
                required
              />
            </div>

            <button type="submit" className="consultBtn" disabled={isLoading}>
              {isLoading ? "Ordering..." : "Order Consultation"} {/* Updated loading text */}
            </button>
          </form>
          <p>Get a product you'll love - guaranteed!</p> {/* Updated message */}
        </div>
      </div>
    </div>
  );
}

export default OrderConsultation; // Export renamed component