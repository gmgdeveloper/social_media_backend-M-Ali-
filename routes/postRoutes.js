const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const postController = require('../controllers/postController');

// Route to create a new post
router.post('/post', authenticateToken, postController.createPost);

// Route to get all posts
router.get('/posts', authenticateToken, postController.getPosts);

// Route to get single post 
router.get('/posts/:id', authenticateToken, postController.getPost);

// Other routes for updating, deleting, and retrieving posts can be added here

module.exports = router;
