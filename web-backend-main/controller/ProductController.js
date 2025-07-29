const Product = require("../model/Product"); // Updated import

// Get all products
const findAll = async (req, res) => {
    try {
        const products = await Product.findAll({ // Updated model usage
            attributes: ['id', 'title', 'description', 'quantity', 'price', 'image']
        });
        console.log("Fetched products:", JSON.stringify(products, null, 2));
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving products", error: err.message });
    }
};

// Save a new product
const save = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { title, description, quantity, price } = req.body;
        if (!req.file) {
            console.error("Image file is missing!");
            return res.status(400).json({ message: "Image file is required." });
        }

        const image = req.file.filename;

        // Save to database
        const newProduct = await Product.create({ title, description, quantity, price, image }); // Updated model usage

        res.status(201).json({ message: "Product created successfully", data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get product by ID
const findById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id); // Updated model usage
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving product", error: err.message });
    }
};

// Delete product by ID
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting product with ID:", id);
        const product = await Product.findByPk(id); // Updated model usage
        if (product) {
            await product.destroy();
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting product", error: err.message });
    }
};

// Update product by ID (handles image update)
const update = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id); // Updated model usage
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { title, description, quantity, price } = req.body;
        const updatedData = { title, description, quantity, price };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await product.update(updatedData); // Updated model usage
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
};

module.exports = { findAll, save, findById, deleteById, update };