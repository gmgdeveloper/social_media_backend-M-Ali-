const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./config/db');
const env = require('dotenv');
const cors = require('cors');

env.config();

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

app.use("/", postRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/chatRooms", chatRoomRoutes);
app.use("/api/gallery", galleryRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Received message:', msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;

// Start the HTTP server
http.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}:${PORT}`);
});
