const express = require("express");
const { findAll, save, findById, deleteById, update } = require("../controller/BookingController");
const BookingValidation = require("../validation/BookingValidation");

const router = express.Router();

// 🔒 Admin Routes (Protected)
router.get("/view_bookings", findAll); 
router.put("/bookings/:id", update);
router.delete("/bookings/:id", deleteById);

// 🔓 Customer Routes (Protected but open to all users)
router.post("/create_bookings", save);  // Use consistent naming
router.get("/:id", findById); // This must be last to avoid conflicts

module.exports = router;
