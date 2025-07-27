const Booking = require("../model/Booking");
const Customer = require("../model/Customer");
const Design = require("../model/Design");

// Get all bookings
const findAll = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json({ bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Error retrieving bookings", error: err.message });
    }
};

// Get a single booking by ID
const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (err) {
        console.error("Error fetching booking:", err);
        res.status(500).json({ message: "Error retrieving booking", error: err.message });
    }
};

// Save a new booking
const save = async (req, res) => {
    try {
      const { full_name, contact_number, email, room_name, design_name, date, description } = req.body;
  
      if (!full_name || !contact_number || !email || !room_name || !design_name || !date || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 1);
  
      if (selectedDate < today) {
        return res.status(400).json({ message: "Cannot book a past date!" });
      }
  
      if (selectedDate > maxDate) {
        return res.status(400).json({ message: "Cannot book more than a year in advance!" });
      }
  
      const newBooking = await Booking.create({
        full_name,
        contact_number,
        email,
        room_name, // Ensure room_name is used
        design_name, // Ensure design_name is used
        date,
        description
      });
  
      res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (err) {
      console.error("Booking creation error:", err);
      res.status(500).json({ message: "Error saving booking", error: err.message });
    }
  };
  

// Update a booking
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, contact_number, email, room, design, date, description } = req.body;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.update({ full_name, contact_number, email, room, design, date, description });

        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({ message: "Error updating booking", error: err.message });
    }
};

// Delete a booking
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.destroy();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ message: "Error deleting booking", error: err.message });
    }
};

module.exports = {
    findAll,
    save,
    findById,
    update,
    deleteById,
};
