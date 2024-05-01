const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Import and initialize Socket.IO
const cors = require('cors');
const env = require('dotenv');

// Import routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require('./routes/followRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');

// Load environment variables
env.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Serve chat HTML page
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/html/chats.html');
});

// API routes
app.use("/", postRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chatRooms", chatRoomRoutes);

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle 'sendMessage' event
    socket.on('sendMessage', (message) => {
        console.log('Received message:', message);
        // Broadcast the message to all connected clients
        io.emit('receiveMessage', message);
    });

    // Handle 'disconnect' event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the HTTP server
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
