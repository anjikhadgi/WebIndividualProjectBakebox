const joi = require("joi");

const bookingSchema = joi.object({
    full_name: joi.string().min(3).max(50).required(),
    contact_number: joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "string.pattern.base": "Contact number must be exactly 10 digits."
    }),
    email: joi.string().email().required(),
    room: joi.string().valid("Living Room", "Bed Room", "Dining", "Kitchen", "Office").required(),
    design: joi.string().valid("Rustic", "Bohemian", "Contemporary-Minimalist", "Traditional").required(),
    date: joi.date().iso().required(),
    description: joi.string().min(10).max(300).required()
});

function BookingValidation(req, res, next) {
    const { error } = bookingSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }

    next();
}

module.exports = BookingValidation;
