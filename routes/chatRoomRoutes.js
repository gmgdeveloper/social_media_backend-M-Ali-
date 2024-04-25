const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const chatRoomController = require('../controllers/chatRoomController');
const chatController = require('../controllers/chatController');

router.post('/createChatRoom', authenticateToken, chatRoomController.createChatRoom);

router.get('/chatRooms', authenticateToken, chatRoomController.getAllChatRooms);

router.get('/chatRoom/:roomId', authenticateToken, chatRoomController.getChatRoom);

router.put('/updateChatRoom/:roomId', authenticateToken, chatRoomController.updateChatRoom);

router.delete('/deleteChatRoom/:roomId', authenticateToken, chatRoomController.deleteChatRoom);

router.post('/:roomId/sendMessage', authenticateToken, chatController.sendMessage);

module.exports = router;
