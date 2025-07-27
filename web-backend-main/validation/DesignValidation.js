const joi = require("joi");

const designSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    description: joi.string().max(500).required()
});

function DesignValidation(req, res, next) {
    // Validate title and description in req.body
    const { error } = designSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }

    // Validate file in req.file (multer)
    if (!req.file) {
        return res.status(400).json({
            message: "Image file is required"
        });
    }

    // Check if the uploaded file is an image
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            message: "Invalid file type. Only jpeg, png, or gif are allowed"
        });
    }

    // Optional: Validate file size (e.g., max size 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
        return res.status(400).json({
            message: "File size exceeds the 5MB limit"
        });
    }

    // Proceed to the next middleware if validation passes
    next();
}

module.exports = DesignValidation;
