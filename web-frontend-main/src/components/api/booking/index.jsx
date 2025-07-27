import React, { useEffect, useState } from "react"; // Import useEffect and useState from React
import { useNavigate } from "react-router-dom"; // For navigation
import '../../../styles/BookingStyles.css'

function BookingIndex() {
  const [bookings, setBookings] = useState([]); // Initial state is an empty array
  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/booking/view_bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();

      // Check if 'bookings' exists and is an array
      if (data.bookings && Array.isArray(data.bookings)) {
        setBookings(data.bookings); // Set bookings state
      } else {
        console.error("Received data.bookings is not an array:", data);
        setBookings([]); // If data is not valid, set an empty array
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Set to empty array if there is an error
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/booking/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // On success, refetch the bookings to update the list
        fetchBookings();
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard"); // Navigate back to the dashboard
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="admin-bookings">
      <button className="back-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      <h2>Booking Requests</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Room</th>
            <th>Design</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.full_name}</td>
                <td>{booking.contact_number}</td>
                <td>{booking.email}</td>
                <td>{booking.room_name || "Not available"}</td>
                <td>{booking.design_name || "Not available"}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.description}</td>
                <td>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No bookings available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingIndex;
