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
            const newRoom = await this.getChatRoomById(result[0].insertId);
            return { status: 201, message: 'Chat room created successfully', room: newRoom.room };
        } else {
            return { status: 500, error: 'Failed to create chat room' };
        }
    } catch (error) {
        console.error('Error creating chat room:', error);
        return { status: 500, error: 'Internal server error' };
    }
};


exports.getChatRoomById = async (roomId) => {
    try {
        const sql = 'SELECT * FROM chat_rooms WHERE room_id = ?';
        const [rows] = await pool.query(sql, [roomId]);

        if (rows.length > 0) {
            return { status: 200, message: 'Chat room found', room: rows[0] };
        } else {
            return { status: 404, message: 'Chat room not found' };
        }

    } catch (error) {
        console.error('Error fetching chat room:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
}

exports.getChatRoomByUsers = async (user1Id, user2Id) => {
    try {
        const sql = 'SELECT * FROM chat_rooms WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?) LIMIT 1';
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