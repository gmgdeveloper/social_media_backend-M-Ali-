// Set up Express 
const express = require("express");
const app = express(); // Initialize app
const db = require('./config/db'); // Require your database pool configuration
const env = require('dotenv'); // Require environment variables

// Load environment variables
env.config();

// Import routes 
const userRoutes = require("./routes/userRoutes");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes 
app.use("/api", userRoutes);

// Set Up PORT
const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}:${PORT}`);
});
