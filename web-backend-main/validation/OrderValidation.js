const joi = require("joi");

const orderSchema = joi.object({ // Renamed schema
    full_name: joi.string().min(3).max(50).required(),
    contact_number: joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "string.pattern.base": "Contact number must be exactly 10 digits."
    }),
    email: joi.string().email().required(),
    quantity: joi.string().valid("1", "2", "3", "4", "5").required(), // Updated field name
    product_name: joi.string().valid("Pastry", "Muffins", "Donuts", "Cookies").required(), // Updated field name
    order_date: joi.date().iso().required(), // Updated field name
    description: joi.string().min(10).max(300).required()
});

function OrderValidation(req, res, next) { // Renamed function
    const { error } = orderSchema.validate(req.body, { abortEarly: false }); // Updated schema validation

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }

    next();
}

module.exports = OrderValidation; // Updated module export