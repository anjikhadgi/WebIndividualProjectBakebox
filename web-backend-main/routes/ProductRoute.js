const express = require("express");
const multer = require("multer");
const path = require("path");
const { findAll, save, findById, deleteById, update } = require("../controller/ProductController"); // Updated import
const ProductValidation = require("../validation/ProductValidation"); // Assuming you'll rename this too

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "product_images"); // Changed folder name for clarity
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Routes
router.get("/view_products", findAll); // Updated route path
router.post("/create_product", upload.single("image"), save); // Updated route path
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", upload.single("image"), update);

module.exports = router;