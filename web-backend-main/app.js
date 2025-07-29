require("dotenv").config(); // Load environment variables from .env file

const express = require("express"); // Import the express package
const cors = require('cors'); // Import the cors package

const { connection, sequelize } = require("./config/db"); // Import database connection and sequelize utilities
const CustomerRouter = require("./routes/CustomerRoute");
const ProductRouter = require("./routes/ProductRoute");
const OrderRouter = require("./routes/OrderRoute");
const AuthRouter = require("./routes/AuthRoute");

const app = express(); // Initialize the express application

const port = process.env.PORT || 5000; // Define the server port, defaults to 5000 if not set in .env

// Configure CORS to allow requests from specific origins
const corsOptions = {
  credentials: true, // Allow sending credentials (e.g., cookies, authorization headers)
  origin: ['http://localhost:5000', 'http://localhost:3000'] // EXACT origins of your frontends
};
app.use(cors(corsOptions)); // Apply CORS middleware to the application

// Parse JSON request bodies (important for POST/PUT requests)
app.use(express.json());
// Parse URL-encoded request bodies (if you also handle form data)
app.use(express.urlencoded({ extended: true }));

// Establish database connection
connection();

// Sync database models with the database in development environment
if (process.env.NODE_ENV === "development") {
  sequelize.sync({ alter: true })
    .then(() => console.log("Database synced!"))
    .catch(err => console.error("Sync error:", err));
}

// Register API routes
app.use("/api/customer", CustomerRouter);
app.use("/api/products", ProductRouter);
// Serve static files (e.g., product images)
app.use("/product_images", express.static("product_images"));
app.use("/api/orders", OrderRouter);
app.use("/api/auth", AuthRouter);

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});