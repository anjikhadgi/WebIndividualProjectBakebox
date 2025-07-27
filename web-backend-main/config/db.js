require("dotenv").config();
const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres', 
  logging: false, 
});

// Function to connect to the database
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = { sequelize, connection };