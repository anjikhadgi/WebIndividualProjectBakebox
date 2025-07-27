const Design = require("../model/Design");

// Get all designs
const findAll = async (req, res) => {
    try {
        const designs = await Design.findAll({
            attributes: ['id', 'title', 'description', 'room', 'style', 'image'] // Include `room` and `style`
        });
        console.log("Fetched designs:", JSON.stringify(designs, null, 2)); // Debugging line
        res.status(200).json(designs);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving designs", error: err.message });
    }
};

// Save a new design
const save = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging
        console.log("Uploaded File:", req.file); // Debugging

        const { title, description, room, style } = req.body; // Include `room` and `style`
        if (!req.file) {
            console.error("Image file is missing!");
            return res.status(400).json({ message: "Image file is required." });
        }

        const image = req.file.filename;

        // Save to database
        const newDesign = await Design.create({ title, description, room, style, image });

        res.status(201).json({ message: "Design created successfully", data: newDesign });
    } catch (error) {
        console.error("Error creating design:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get design by ID
const findById = async (req, res) => {
    try {
        const design = await Design.findByPk(req.params.id);
        if (design) {
            res.status(200).json(design);
        } else {
            res.status(404).json({ message: "Design not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving design", error: err.message });
    }
};

// Delete design by ID
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting design with ID:", id); // Debugging line
        const design = await Design.findByPk(id);
        if (design) {
            await design.destroy();
            res.status(200).json({ message: "Design deleted successfully" });
        } else {
            res.status(404).json({ message: "Design not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting design", error: err.message });
    }
};

// Update design by ID (handles image update)
const update = async (req, res) => {
    try {
        const design = await Design.findByPk(req.params.id);
        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        const { title, description, room, style } = req.body; // Include `room` and `style`
        const updatedData = { title, description, room, style };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await design.update(updatedData);
        res.status(200).json(design);
    } catch (err) {
        res.status(500).json({ message: "Error updating design", error: err.message });
    }
};

module.exports = { findAll, save, findById, deleteById, update };