const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const postController = require('../controllers/postController');

// Route to create a new post
router.post('/posts', authenticateToken, postController.createPost);

// Other routes for updating, deleting, and retrieving posts can be added here

module.exports = router;
