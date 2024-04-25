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
            null // Assuming no deletion initially
        ];

        const sql = `
            INSERT INTO messages (chat_room_id, from_user_id, to_user_id, content, timestamp, status, reply_to_message_id, deleted_at)
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
        const newMessage = await this.getMessageById(messageId);

        return {
            status: newMessage ? 201 : 500,
            message: newMessage ? 'Message inserted successfully' : 'Failed to insert message',
            data: newMessage
        };
    } catch (error) {
        console.error('Failed to insert message:', error);
        return {
            status: 500,
            message: `Failed to insert message: ${error.message}`
        };
    }
};


exports.uploadToMediaTable = async (chatRoomId, uploaderId, filename, mediaType) => {
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
        const uploadTimestamp = formattedDate

        // Construct the SQL query to insert media information into the media table
        const sql = `
            INSERT INTO media (chat_room_id, uploader_id, filename, media_type, upload_timestamp)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Define the values to be inserted into the media table
        const values = [chatRoomId, uploaderId, filename, mediaType, uploadTimestamp];

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

        // Return the generated media ID
        return {
            status: 201,
            message: 'Media inserted successfully',
            mediaId: result.insertId
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
            SELECT * FROM media
            WHERE chat_room_id = ?
        `;
        const [mediaRows] = await pool.query(mediaSql, [message.chat_room_id]);

        return {
            status: 200,
            message: 'Message retrieved successfully',
            data: {
                message: message,
                media: mediaRows
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

