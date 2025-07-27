const express = require("express");
const { findAll, save, findById, deleteById, update } = require("../controller/OrderController"); // Controller import is already correct
const OrderValidation = require("../validation/OrderValidation"); // Updated validation import (assuming you'll rename this file too)

const router = express.Router();

// 🔒 Admin Routes (Protected)
router.get("/view_orders", findAll);    // Updated route path
router.put("/orders/:id", update);      // Updated route path
router.delete("/orders/:id", deleteById); // Updated route path

// 🔓 Customer Routes (Protected but open to all users)
router.post("/create_order", save);     // Updated route path for consistency
router.get("/:id", findById); // This must be last to avoid conflicts

module.exports = router;