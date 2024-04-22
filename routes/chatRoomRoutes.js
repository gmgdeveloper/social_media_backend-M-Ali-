const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const chatRoomController = require('../controllers/chatRoomController');

// Create a new chat room
router.post('/createChatRoom', authenticateToken, chatRoomController.createChatRoom);

// Add more routes as needed

module.exports = router;
