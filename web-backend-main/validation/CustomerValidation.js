const Joi = require("joi");

const customerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format"
    }),

    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long"
    })
});

function CustomerValidation(req, res, next) {
    const { error } = customerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }

    next();
}

module.exports = CustomerValidation;
