const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const likeController = require('../controllers/likeController');


router.post('/like/:id', authenticateToken, likeController.likePost);


module.exports = router;
