import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "../../../styles/BookConsultation.css";
import bookConsult from "../../../assets/images/bookConsult.avif";

function BookConsultation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    room: "",
    design: "",
    date: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const bookConsultation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");

      // Ensure room and design are renamed to room_name and design_name
      const bookingData = {
        ...data,
        room_name: data.room, // room should be mapped to room_name
        design_name: data.design, // design should be mapped to design_name
      };

      return axios.post("http://localhost:8080/api/booking/create_bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      alert("✅ Booking successful!");
      setFormData({
        full_name: "",
        contact_number: "",
        email: "",
        room: "",
        design: "",
        date: "",
        description: "",
      });
      setIsLoading(false);
    },
    onError: (error) => {
      alert(`❌ Booking failed: ${error.response?.data?.message || "Unknown error"}`);
      setIsLoading(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);

    if (selectedDate < today) {
      alert("⚠️ Cannot book a past date!");
      setIsLoading(false);
      return;
    }

    if (selectedDate > maxDate) {
      alert("⚠️ Cannot book more than a year in advance!");
      setIsLoading(false);
      return;
    }

    // Ensure both room and design are selected
    if (!formData.room || !formData.design) {
      alert("⚠️ Room and Design must be selected!");
      setIsLoading(false);
      return;
    }

    bookConsultation.mutate(formData);
  };

  return (
    <div className="bookWrapper">
      <div className="bg-image" style={{ backgroundImage: `url(${bookConsult})` }}>
        <div className="book-header">
          <h1>Tell us your story</h1>
          <h2>So we can help create your dream space.</h2>
        </div>
        <div className="bookContent">
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
              <label>Select by Room:</label>
              <select name="room" value={formData.room} onChange={handleChange} required>
                <option value="">Select Room</option>
                <option value="Living Room">Living Room</option>
                <option value="Bed Room">Bed Room</option>
                <option value="Dining">Dining</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select by Design:</label>
              <select name="design" value={formData.design} onChange={handleChange} required>
                <option value="">Select Design</option>
                <option value="Rustic">Rustic</option>
                <option value="Modern">Modern</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Traditional">Traditional</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
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
              {isLoading ? "Booking..." : "Book Consultation"}
            </button>
          </form>
          <p>Get a design you'll love - guaranteed!</p>
        </div>
      </div>
    </div>
  );
}

export default BookConsultation;
