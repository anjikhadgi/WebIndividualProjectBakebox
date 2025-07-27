const express = require("express");
const router = express.Router();
const { register, login, findAll, findById, deleteById, update, getProfile } = require("../controller/CustomerController");
const { authenticateToken, authorizeRole } = require("../middleware/Auth");

// Public routes 
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/view_customers", findAll); // Admin only
router.get("/profile", getProfile); // Accessible to authenticated customers
router.get("/:id", findById); // Accessible to both admin and customer
router.delete("/:id",  deleteById); // Admin only
router.put("/:id", update); // Accessible to both admin and customer


module.exports = router;