// index.js
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const db = require('./config/db');
const env = require('dotenv');
env.config();
const cors = require('cors');
const setupSocket = require('./helpers/socket');

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require('./routes/followRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/html/chats.html');
})

app.use("/", postRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chatRooms", chatRoomRoutes);

// Initialize io using setupSocket function
const io = setupSocket(http);

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;

// Start the HTTP server
http.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}:${PORT}`);
});
