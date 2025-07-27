const express = require("express");
const multer = require("multer");
const path = require("path");
const { findAll, save, findById, deleteById, update } = require("../controller/DesignController");
const DesignValidation = require("../validation/DesignValidation");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "design_images"); // Ensure this folder exists
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
router.get("/view_design", findAll);
router.post("/create_design", upload.single("image"), save);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", upload.single("image"), update);

module.exports = router;