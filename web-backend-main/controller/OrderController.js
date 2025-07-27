const Order = require("../model/Order"); // Updated import
const Customer = require("../model/Customer");
const Product = require("../model/Product"); // Updated import

// Get all orders
const findAll = async (req, res) => {
    try {
        const orders = await Order.findAll(); // Updated model usage
        res.status(200).json({ orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Error retrieving orders", error: err.message });
    }
};

// Get a single order by ID
const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id); // Updated model usage

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "Error retrieving order", error: err.message });
    }
};

// Save a new order
const save = async (req, res) => {
    try {
        // Updated field names to match Order model (order_date instead of date)
        const { full_name, contact_number, email, quantity, product_name, order_date, description } = req.body;

        if (!full_name || !contact_number || !email || !quantity || !product_name || !order_date || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const selectedDate = new Date(order_date); // Use order_date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 1);

        if (selectedDate < today) {
            return res.status(400).json({ message: "Cannot place an order for a past date!" }); // Updated message
        }

        if (selectedDate > maxDate) {
            return res.status(400).json({ message: "Cannot place an order more than a year in advance!" }); // Updated message
        }

        const newOrder = await Order.create({ // Updated model usage
            full_name,
            contact_number,
            email,
            quantity,
            product_name,
            order_date, // Use order_date
            description
        });

        res.status(201).json({ message: "Order created successfully", order: newOrder }); // Updated message and variable
    } catch (err) {
        console.error("Order creation error:", err); // Updated message
        res.status(500).json({ message: "Error saving order", error: err.message }); // Updated message
    }
};


// Update an order
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // Updated field names to match Order model (order_date instead of date)
        // Also adjusted `room` and `design` to `quantity` and `product_name` to match model fields
        const { full_name, contact_number, email, quantity, product_name, order_date, description } = req.body;

        const order = await Order.findByPk(id); // Updated model usage
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.update({ full_name, contact_number, email, quantity, product_name, order_date, description }); // Updated fields

        res.status(200).json({ message: "Order updated successfully", order }); // Updated message and variable
    } catch (err) {
        console.error("Error updating order:", err); // Updated message
        res.status(500).json({ message: "Error updating order", error: err.message }); // Updated message
    }
};

// Delete an order
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id); // Updated model usage

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.destroy();
        res.status(200).json({ message: "Order deleted successfully" }); // Updated message
    } catch (err) {
        console.error("Error deleting order:", err); // Updated message
        res.status(500).json({ message: "Error deleting order", error: err.message }); // Updated message
    }
};

module.exports = {
    findAll,
    save,
    findById,
    update,
    deleteById,
};