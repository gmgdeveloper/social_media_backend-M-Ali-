const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken')
const followController = require('../controllers/followController');

router.post('/follow', authenticateToken, followController.followUser);

router.post('/unfollow', authenticateToken, followController.unfollowUser);

router.get('/followers/:userId', authenticateToken, followController.getFollowers);

router.get('/following/:userId', authenticateToken, followController.getFollowing);

module.exports = router;
