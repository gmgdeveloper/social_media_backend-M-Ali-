// ChatRoom controller 
const chatRoomModel = require('../models/ChatRoom');

exports.createChatRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const user1Id = req.user.id;
        const user2Id = req.params.userId;


        if (!roomName || roomName.trim() === '') {
            return res.status(400).json({
                status: 400,
                error: 'Room name is required'
            });
        }


        if (!user1Id || !user2Id || user1Id === user2Id) {
            return res.status(400).json({
                status: 400,
                error: 'Invalid user IDs'
            });
        }

        const existingChatRoom = await chatRoomModel.getChatRoomByUsers(user1Id, user2Id);

        if (existingChatRoom.status === 200) {
            return res.status(200).json({
                status: existingChatRoom.status || 200,
                message: existingChatRoom.message || 'Chat room already exists',
                chatRoomId: existingChatRoom.room.id
            });
        }

        const result = await chatRoomModel.createChatRoom(roomName, user1Id, user2Id);

        if (condition) {

        }
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};
