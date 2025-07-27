require("dotenv").config();
const express = require("express");
const {connection, sequelize } = require("./config/db");  
const CustomerRouter = require("./routes/CustomerRoute"); 
const DesignRouter = require("./routes/DesignRoute");     
const BookingRouter = require("./routes/BookingRoute"); 
const AuthRouter = require("./routes/AuthRoute"); 

const app = express();

const cors = require('cors');

const corsOptions = {
  credentials:true,
  origin:['http://localhost:3000']
};
app.use(cors(corsOptions));

// Establish database connection
connection();

if (process.env.NODE_ENV === "development") { 
  sequelize.sync({ alter: true })
    .then(() => console.log("Database synced!"))
    .catch(err => console.error("Sync error:", err));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Add this for form data

app.use("/api/customer", CustomerRouter);
app.use("/api/design", DesignRouter);
app.use("/design_images", express.static("design_images"));
app.use("/api/booking", BookingRouter);
app.use("/api/auth", AuthRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

