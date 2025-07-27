const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Customer = require("./Customer");
const Product = require("./Product"); // Updated import

const Order = sequelize.define("Order", { // Renamed model
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // The following fields seem like they should be linked via Customer and Product foreign keys
    // rather than duplicated here, but I'll keep them for now as per your original structure
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    quantity: { // This might be redundant if linked to Product which has 'room'
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    product_name: { // This might be redundant if linked to Product which has 'title'
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    order_date: { // Renamed 'date' to 'order_date' for clarity
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { isDate: true }
    },
    description: { // Perhaps this is 'order_description' or 'special_instructions'
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    // Consider adding status field for the order (e.g., 'pending', 'completed', 'cancelled')
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // Example default value
    }
}, {
    timestamps: true,
    // Optional: Define custom table name if you want it different from "Orders"
    // tableName: 'your_custom_orders_table_name'
});

// Define associations (assuming Customer and Product are already defined and exported)
// An Order belongs to a Customer
Order.belongsTo(Customer, { foreignKey: 'customerId' }); // Assuming 'customerId' foreign key in Order table
// An Order is for a specific Product (formerly Design)
Order.belongsTo(Product, { foreignKey: 'productId' }); // Assuming 'productId' foreign key in Order table

// Optional: Define inverse associations in Customer and Product models if needed
// Customer.hasMany(Order, { foreignKey: 'customerId' });
// Product.hasMany(Order, { foreignKey: 'productId' });


module.exports = Order;