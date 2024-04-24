const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken')
const followController = require('../controllers/followController');

router.post('/follow', authenticateToken, followController.followUser);

router.post('/unfollow', authenticateToken, followController.unfollowUser);

router.get('/followers/:userId', authenticateToken, followController.getFollowers);

router.get('/following/:userId', authenticateToken, followController.getFollowing);

router.get("/getAllFriends/", authenticateToken, followController.getFriends)

router.get("/getAllFriends/:userId", authenticateToken, followController.getFriends)

module.exports = router;
