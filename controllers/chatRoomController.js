// ChatRoom controller 
const chatRoomModel = require('../models/ChatRoom');
const userModel = require('../models/User');

exports.createChatRoom = async (req, res) => {
    try {
        const { userId } = req.body;
        const user1Id = req.user.id;

        const roomuser = await userModel.getUserByField("id", userId);
        const roomName = roomuser.full_name

        if (!roomName || roomName.trim() === '') {
            return res.status(400).json({
                status: 400,
                error: 'Room name is required'
            });
        }


        if (!user1Id || !userId || user1Id === userId) {
            return res.status(400).json({
                status: 400,
                error: 'Invalid user IDs'
            });
        }

        const existingChatRoom = await chatRoomModel.getChatRoomByUsers(user1Id, userId);

        if (existingChatRoom.status === 200) {
            return res.status(200).json({
                status: existingChatRoom.status || 200,
                message: existingChatRoom.message || 'Chat room already exists',
                chatRoom: existingChatRoom.room
            });
        }

        const result = await chatRoomModel.createChatRoom(roomName, user1Id, userId);

        if (result.status === 201) {
            res.status(result.status).json(result);
        } else {
            res.status(result.status).json(result);
        }

    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.getAllChatRooms = async (req, res) => {
    try {
        const allChatRooms = await chatRoomModel.getAllChatRooms();

        if (allChatRooms.status === 200) {
            res.status(200).json({
                status: 200,
                message: 'Chat rooms fetched successfully',
                chatRooms: allChatRooms.chatRooms
            });
        } else {
            res.status(allChatRooms.status).json(allChatRooms);
        }
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

// Controller function to get a chat room with its messages and media
exports.getChatRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId; // Assuming roomId is passed as a route parameter

        // Retrieve chat room details with messages and media
        const result = await chatRoomModel.getChatRoomById(roomId);

        // console.log("result", result);

        // Check the status returned by the model function
        if (result.status === 200) {
            // If chat room found, send the response with the chat room data
            res.status(200).json({
                status: 200,
                message: 'Chat room found',
                chatRoom: result.chatRoom
            });
        } else {
            // If chat room not found or error occurred, send the appropriate error response
            res.status(result.status).json({
                status: result.status,
                error: result.error || 'Failed to retrieve chat room'
            });
        }
    } catch (error) {
        // Handle internal server error
        console.error('Error retrieving chat room:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

// update chat room 
exports.updateChatRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const chatRoomId = req.params.roomId;

        if (!roomName || roomName.trim() === '') {
            return res.status(400).json({
                status: 400,
                error: 'Room name is required'

            })
        }

        if (chatRoomId === undefined || chatRoomId === null || chatRoomId === '') {
            return res.status(400).json({
                status: 400,
                error: 'Chat room ID is required'
            })
        }

        const result = await chatRoomModel.updateChatRoom(roomName, chatRoomId);

        if (result.status === 200) {
            res.status(result.status).json(result);
        } else {
            res.status(result.status).json(result);
        }


    } catch (error) {
        console.error('Error updating chat room:', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
}

exports.deleteChatRoom = async (req, res) => {
    try {
        const chatRoomId = req.params.roomId;

        if (chatRoomId === undefined || chatRoomId === null || chatRoomId === '') {
            return res.status(400).json({
                status: 400,
                error: 'Chat room ID is required'
            })
        }

        const result = await chatRoomModel.deleteChatRoom(chatRoomId);

        if (result.status === 200) {
            res.status(result.status).json(result);
        } else {
            res.status(result.status).json(result);
        }

    } catch (error) {
        console.error('Error deleting chat room:', error);
        res.status(500).json({ status: 500, error: 'Internal server error' });
    }
}
