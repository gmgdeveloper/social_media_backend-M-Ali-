const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const commentController = require('../controllers/commentController');

router.get('/:id', commentController.getAllCommentsOfAPost);

router.get('/', authenticateToken, commentController.getAllComments);

router.post('/addComment/:id', authenticateToken, commentController.createComment);

router.put('/editComment/:id', authenticateToken, commentController.editComment);
 
router.delete('/deleteComment/:id', authenticateToken, commentController.deleteCommentById);

module.exports = router;
