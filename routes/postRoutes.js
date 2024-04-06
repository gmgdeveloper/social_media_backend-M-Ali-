const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);

router.post('/createPost', authenticateToken, postController.createPost);

router.get('/:id', authenticateToken, postController.getSinglePost);

router.get('/user/:id', authenticateToken, postController.getPostsByUser);

router.put('/:id', authenticateToken, postController.updatePostById)

router.delete('/:id', authenticateToken, postController.deletePostById);

module.exports = router;
