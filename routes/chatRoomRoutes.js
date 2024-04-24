// chatRoom routes

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const chatRoomController = require('../controllers/chatRoomController');
// const chatController = require('../controllers/chatController');

// Create a new chat room
router.post('/createChatRoom', authenticateToken, chatRoomController.createChatRoom);

// Fetch all chat rooms
router.get('/chatRooms', authenticateToken, chatRoomController.getAllChatRooms);

// Update a chat room
router.put('/updateChatRoom/:roomId', authenticateToken, chatRoomController.updateChatRoom);

// Delete a chat room
router.delete('/deleteChatRoom/:roomId', authenticateToken, chatRoomController.deleteChatRoom)

// Send message to a chat room
// router.post('/:roomId/sendMessage', authenticateToken, chatController.sendMessage);

// Retrieve all messages in a chat room
// router.get('/:roomId/messages', authenticateToken, chatController.getMessages);

// Add more routes as needed

module.exports = router;
