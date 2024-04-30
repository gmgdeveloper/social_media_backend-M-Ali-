// ChatRoom Model
const pool = require('../config/db');

exports.createChatRoom = async (roomName, user1Id, user2Id) => {

    if (!roomName || !user1Id || !user2Id || user1Id === user2Id) {
        return { status: 400, error: 'Invalid input parameters' };
    }

    try {

        const date = new Date();
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).replace(/ GMT\+\d{4} \(.*\)$/, '');

        const sql = 'INSERT INTO chat_rooms (room_name, user1_id, user2_id, created_at) VALUES (?, ?, ?, ?)';
        const values = [roomName, user1Id, user2Id, formattedDate];
        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 1) {
            const newRoom = await this.getChatRoomById(result.insertId);
            return { status: 201, message: 'Chat room created successfully', room: newRoom.room };
        } else {
            return { status: 500, error: 'Failed to create chat room' };
        }
    } catch (error) {
        console.error('Error creating chat room:', error);
        return { status: 500, error: 'Internal server error' };
    }
};

exports.getAllChatRooms = async () => {
    try {
        const sql = 'SELECT * FROM chat_rooms';
        const [rows] = await pool.query(sql);
        console.log(rows);
        if (rows.length > 0) {
            return { status: 200, message: 'Active chat rooms found', chatRooms: rows };
        } else {
            return { status: 404, message: 'No active chat rooms found' };
        }
    } catch (error) {
        console.error('Error fetching active chat rooms:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
};

exports.getChatRoomById = async (roomId) => {
    try {
        // Get chat room details
        const roomSql = 'SELECT * FROM chat_rooms WHERE room_id = ? AND is_deleted <> 1';
        const [roomRows] = await pool.query(roomSql, [roomId]);

        if (roomRows.length === 0) {
            return { status: 404, message: 'Chat room not found' };
        }

        const chatRoom = roomRows[0];

        // Get messages for the chat room, excluding deleted messages
        const messageSql = 'SELECT * FROM messages WHERE chat_room_id = ? AND is_deleted <> 1 ORDER BY message_id DESC';
        const [messageRows] = await pool.query(messageSql, [roomId]);

        // Fetch media for each message and attach it to the message object, excluding deleted media
        for (const message of messageRows) {
            const mediaSql = 'SELECT * FROM media WHERE message_id = ? AND is_deleted <> 1';
            const [mediaRows] = await pool.query(mediaSql, [message.message_id]);
            message.media = mediaRows;
        }

        chatRoom.messages = messageRows;

        return { status: 200, message: 'Chat room found', chatRoom: chatRoom };
    } catch (error) {
        console.error('Error fetching chat room:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
};


exports.updateChatRoom = async (roomName, roomId) => {
    if (!roomId || !roomName) {
        return { status: 400, error: 'Invalid input parameters' };
    }

    try {
        const sql = 'UPDATE chat_rooms SET room_name = ? WHERE room_id = ?';
        const values = [roomName, roomId];
        const [result] = await pool.query(sql, [roomName, roomId]);



        if (result.affectedRows === 1) {
            const updatedRoom = await this.getChatRoomById(roomId);
            return { status: 200, message: 'Chat room updated successfully', room: updatedRoom.room };
        } else {
            return { status: 404, message: 'Something went wrong with database.' };
        }

    } catch (error) {
        console.error('Error updating chat room:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
}

exports.deleteChatRoom = async (roomId) => {
    if (!roomId) {
        return { status: 400, error: 'Invalid input parameters' };
    }

    try {
        // Update chat_room table
        const updateChatRoomSql = 'UPDATE chat_rooms SET is_deleted = 1 WHERE room_id = ?';
        await pool.query(updateChatRoomSql, [roomId]);

        // Update message table
        const updateMessageSql = 'UPDATE messages SET is_deleted = 1 WHERE chat_room_id = ?';
        await pool.query(updateMessageSql, [roomId]);

        // Update media table
        const updateMediaSql = 'UPDATE media SET is_deleted = 1 WHERE chat_room_id = ?';
        await pool.query(updateMediaSql, [roomId]);

        return { status: 200, message: 'Chat room and related records marked as deleted successfully' };
    }
    catch (error) {
        console.error('Error marking chat room and related records as deleted:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
}

exports.getChatRoomByUsers = async (user1Id, user2Id) => {
    try {
        const sql = 'SELECT * FROM chat_rooms WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)) AND is_deleted <> 1 LIMIT 1';
        const [rows] = await pool.query(sql, [user1Id, user2Id, user2Id, user1Id]);

        if (rows.length > 0) {
            return { status: 200, message: 'Chat room found', room: rows[0] };
        } else {
            return { status: 404, message: 'Chat room not found' };
        }
    } catch (error) {
        console.error('Error fetching chat room:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
};
