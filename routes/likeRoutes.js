const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const likeController = require('../controllers/likeController');


router.get('/:id', likeController.getAllLikesOfAPost);

router.post('/like/:id', authenticateToken, likeController.likeAndUnlikePost);

module.exports = router;
