const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const postController = require('../controllers/postController');

// Route to create a new post
router.post('/createPost', authenticateToken, postController.createPost);

// Route to get a single post 
router.get('/:id', authenticateToken, postController.getSinglePost);

// Route to get all posts
router.get('/', authenticateToken, postController.getAllPosts);

// Route to get all posts of a specific user
router.get('/user/:id', authenticateToken, postController.getPostsByUser);

// Route to update a post
router.put('/:id', authenticateToken, postController.updatePostById)

// Route to delete a post
router.delete('/:id', authenticateToken, postController.deletePostById);

// Other routes for updating, deleting, and retrieving posts can be added here

module.exports = router;
