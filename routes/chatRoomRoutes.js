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

// Chat routes
router.post('/:roomId/sendMessage', authenticateToken, chatController.sendMessage);

router.get('/:roomId/getMessages', authenticateToken, chatController.getMessages);

router.get('/:roomId/getMessage/:messageId', authenticateToken, chatController.getMessage);

router.delete('/:roomId/deleteMessage/:messageId', authenticateToken, chatController.deleteMessage);

router.put('/:roomId/updateMessage/:messageId', authenticateToken, chatController.updateMessage);

module.exports = router;
