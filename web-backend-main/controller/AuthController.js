const bcrypt = require('bcrypt');  // Correct bcrypt package
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;  // Correct way to access the secret from .env
const Cred = require('../model/Credential');  // Make sure this matches the model name

// Register new user
const register = async (req, res) => {
    const { username, password, role } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const cred = await Cred.create({ username, password: hashedPassword, role });

    // Send the created user object (or just a success response)
    res.status(201).json({ message: 'User registered successfully', user: cred });
};

// Login user
const login = async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const cred = await Cred.findOne({ where: { username } });

    // If the user doesn't exist or the password is incorrect, return error
    if (!cred || !(await bcrypt.compare(password, cred.password))) {
        return res.status(403).json({ message: "Not Invalid " });
    }

    // Create a JWT token
    const token = jwt.sign(
        { username: cred.username, role: cred.role },
        JWT_SECRET, 
        { expiresIn: '1h' }
    );

    // Send back the token
    res.json({ token });
};

module.exports = { register };
