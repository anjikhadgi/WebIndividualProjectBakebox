const joi = require("joi");

const productSchema = joi.object({ // Renamed schema
    title: joi.string().min(3).max(100).required(),
    description: joi.string().max(500).required(),
    // Assuming 'room' and 'style' are also part of your Product model
    quantity: joi.string().valid("1", "2", "3", "4", "5", "6", "7").required(), // Added validation for room
    price: joi.string().valid("10$", "20$", "30$", "40$","15$", "25$", "5$").required() // Added validation for style
});

function ProductValidation(req, res, next) { // Renamed function
    // Validate title, description, room, and style in req.body
    const { error } = productSchema.validate(req.body, { abortEarly: false }); // Updated schema validation

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }

    // Validate file in req.file (multer) - for new product creation or updating image
    // Note: If update allows partial updates without a new image, you might need to adjust this logic.
    // For now, it assumes an image is always required if this validation runs.
    if (!req.file) {
        return res.status(400).json({
            message: "Product image file is required" // Updated message
        });
    }

    // Check if the uploaded file is an image
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Added webp
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            message: "Invalid file type. Only jpeg, png, gif, or webp are allowed for product images." // Updated message
        });
    }

    // Optional: Validate file size (e.g., max size 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
        return res.status(400).json({
            message: "Product image file size exceeds the 5MB limit" // Updated message
        });
    }

    // Proceed to the next middleware if validation passes
    next();
}

module.exports = ProductValidation; // Updated module export