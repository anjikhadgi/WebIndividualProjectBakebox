const Customer = require("../model/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register a new customer
const register = async (req, res) => {
  const { full_name, email, contact_number, password } = req.body;

  try {
    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer with full_name and contact_number
    const customer = await Customer.create({
      full_name,
      email,
      contact_number,
      password: hashedPassword
    });

    // Generate a JWT token
    const token = generateToken(customer.id, "customer");

    res.status(201).json({ message: "Customer registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login a customer
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the customer by email
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken(customer.id, customer.role);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all customers (for admin only)
const findAll = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: ['id', 'full_name', 'email', 'contact_number'] // Include full_name and contact_number
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get a customer by ID (for admin and customer)
const findById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a customer by ID (for admin only)
const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a customer's email or password (for admin and customer)
const update = async (req, res) => {
  const { id } = req.params;
  const { email, password, full_name, contact_number } = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if email is already in use
    if (email) {
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer && existingCustomer.id !== customer.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      customer.email = email;
    }

    // Update full name and contact number
    if (full_name) {
      customer.full_name = full_name;
    }
    if (contact_number) {
      customer.contact_number = contact_number;
    }

    // Hash password if updated
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
    }

    await customer.save();
    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the profile of the authenticated customer
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const customer = await Customer.findByPk(req.user.userId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, findAll, findById, deleteById, update, getProfile };