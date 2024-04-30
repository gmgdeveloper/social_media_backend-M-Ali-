const pool = require('../config/db');

// model function for inserting a message
exports.insertMessage = async (chatRoomId, fromUserId, toUserId, content, reply_to_message_id) => {
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

        const timestamp = formattedDate;

        const status = 'pending'; // Assuming the default status is pending

        const values = [
            chatRoomId,
            fromUserId,
            toUserId,
            content || null,
            timestamp,
            status,
            reply_to_message_id || null, // Assuming no reply_to_message_id initially
            0 // Assuming no deletion initially
        ];

        const sql = `
            INSERT INTO messages (chat_room_id, from_user_id, to_user_id, content, timestamp, status, reply_to_message_id, is_deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, values);

        if (result.affectedRows < 1) {
            return {
                status: 500,
                message: 'Failed to insert message'
            }
        }

        const messageId = result.insertId;

        return {
            status: 201,
            message: 'Message inserted successfully',
            id: messageId
        };
    } catch (error) {
        console.error('Failed to insert message:', error);
        return {
            status: 500,
            message: `Failed to insert message: ${error.message}`
        };
    }
};

exports.uploadToMediaTable = async (chatRoomId, uploaderId, filename, mediaType, message_id) => {
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

        // Get current timestamp
        const uploadTimestamp = formattedDate;

        // Construct the SQL query to insert media information into the media table
        const sql = `
            INSERT INTO media (chat_room_id, uploader_id, filename, media_type, message_id, upload_timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Define the values to be inserted into the media table
        const values = [chatRoomId, uploaderId, filename, mediaType, message_id, uploadTimestamp];

        // Execute the SQL query
        const [result] = await pool.query(sql, values);

        // Check if media insertion was successful
        if (result.affectedRows < 1) {
            // If insertion failed, return an error response
            return {
                status: 500,
                error: 'Failed to insert media'
            };
        }

        // Return the generated media ID along with the updated message data
        return {
            status: 201,
            message: 'Media inserted successfully',
        };
    } catch (error) {
        // If an error occurs, return an error response as JSON
        return {
            status: 500,
            error: `Failed to insert media: ${error.message}`
        };
    }
};

exports.getMessageById = async (messageId) => {
    try {
        // Fetch the message
        const messageSql = `
            SELECT * FROM messages
            WHERE message_id = ?
        `;
        const [messageRows] = await pool.query(messageSql, [messageId]);

        if (messageRows.length === 0) {
            return {
                status: 404,
                message: 'Message not found'
            };
        }

        const message = messageRows[0];

        // Fetch associated media
        const mediaSql = `
            SELECT *
            FROM media
            WHERE message_id = ?
        `;
        const [mediaRows] = await pool.query(mediaSql, [messageId]);

        // Convert mediaRows to a JSON array
        const media = mediaRows.map(row => ({
            media_id: row.media_id,
            uploader_id: row.uploader_id,
            file_name: row.filename,
            media_type: row.media_type,
            message_id: row.message_id,
            upload_time: row.upload_timestamp
        }));

        return {
            status: 200,
            message: 'Message retrieved successfully',
            data: {
                message: message,
                media: media
            }
        };
    } catch (error) {
        console.error('Failed to get message by ID:', error);
        return {
            status: 500,
            error: `Failed to get message by ID: ${error.message}`
        };
    }
};

exports.getMessages = async (chatRoomId, userId) => {
    try {
        // Fetch messages
        const messageSql = `
            SELECT * FROM messages
            WHERE chat_room_id = ?
            AND (from_user_id = ? OR to_user_id = ?)
            ORDER BY message_id DESC
        `;

        const [messageRows] = await pool.query(messageSql, [chatRoomId, userId, userId]);

        if (messageRows.length === 0) {
            return {
                status: 404,
                message: 'No messages found'
            };
        }

        // Fetch media for each message and attach it to the message object
        for (const message of messageRows) {
            const mediaSql = 'SELECT * FROM media WHERE message_id = ?';
            const [mediaRows] = await pool.query(mediaSql, [message.message_id]);
            message.media = mediaRows;
        }

        return {
            status: 200,
            message: 'Messages retrieved successfully',
            data: messageRows
        };
    } catch (error) {
        console.error('Failed to get messages:', error);
        return {
            status: 500,
            error: `Failed to get messages: ${error.message}`
        };
    }
};

exports.deleteMessage = async (messageId) => {
    try {
        // First, delete associated media
        const deleteMediaQuery = 'DELETE FROM media WHERE message_id = ?';
        await pool.query(deleteMediaQuery, [messageId]);

        // Then, delete the message
        const deleteMessageQuery = 'DELETE FROM messages WHERE message_id = ?';
        const [result] = await pool.query(deleteMessageQuery, [messageId]);

        if (result.affectedRows > 0) {
            return { status: 200, message: 'Message deleted successfully' };
        } else {
            return { status: 404, message: 'Message not found' };
        }
    } catch (error) {
        console.error('Error deleting message and associated media:', error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
};

exports.updateMessage = async (messageId, newMessage) => {
    try {
        messageId = parseInt(messageId);
        if (!messageId) {
            const err = {
                status: 500,
                message: "Invalid message ID"
            }
            return err;
        }

        if (!newMessage) {
            const err = {
                status: 500,
                message: "Message is required"
            }
            return err;
        }

        const updateMessageQuery = 'UPDATE messages SET content = ? WHERE message_id = ?';
        const [result] = await pool.query(updateMessageQuery, [newMessage, messageId]);

        if (result.affectedRows > 0) {
            return { status: 200, message: 'Message updated successfully' };
        } else {
            return { status: 404, message: 'Message not found' };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, error: error.message || 'Internal server error' };
    }
}
