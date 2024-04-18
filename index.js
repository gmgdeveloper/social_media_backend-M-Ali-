const express = require("express");
const app = express();
const db = require('./config/db');
const env = require('dotenv');
const cors = require('cors')

env.config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require('./routes/followRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/", postRoutes)
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/gallery", galleryRoutes);

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;

app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}:${PORT}`);
});
