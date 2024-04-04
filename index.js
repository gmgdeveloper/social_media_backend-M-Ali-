// Set up Express 
const express = require("express");
const app = express(); // Initialize app
const db = require('./config/db'); // Require your database pool configuration
const env = require('dotenv'); // Require environment variables
const cors = require('cors')

// Load environment variables
env.config();

// Import routes 
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Routes 
app.use("/", postRoutes)
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);

// Set Up PORT
const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}:${PORT}`);
});
