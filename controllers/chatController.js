const chatModel = require('../models/Chat')
const multer = require('multer');
const path = require('path');
const env = require("dotenv");
const setupSocket = require('../helpers/socket');
const io = setupSocket(); // Invoke the function to initialize io

env.config()

const baseUrl = process.env.BASE_URL || 'http://localhost';
const port = process.env.PORT || 8000;

// Define storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the destination directory based on the file type
        const isImage = file.mimetype.startsWith('image');
        const isVideo = file.mimetype.startsWith('video');
        const isAudio = file.mimetype.startsWith('audio')

        let destPath = './public/uploads/messages/';

        if (isImage) {
            destPath += 'images/';
        } else if (isVideo) {
            destPath += 'videos/';
        } else if (isAudio) {
            destPath += 'audios/';
        }
        else {
            destPath += 'others/';
        }

        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
        cb(null, file.fieldname + '-' + Date.now() + "-" + fileNameWithoutSpaces);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|mp3|mp4/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images and videos only (JPEG, JPG, PNG, MP4)');
        }
    }
}).array('media', 15);

exports.sendMessage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    status: 400,
                    error: err.message
                });
            }

            const fromUserId = req.user.id;

            if (!fromUserId) {
                return res.status(400).json({
                    status: 400,
                    error: 'User ID is required'
                });
            }

            const chatRoomId = req.params.roomId;
            const { text, toUserId } = req.body;
            const replyToMessageId = req.body.replyToMessageId || null;
            const mediaFiles = req.files || [];

            const message = await chatModel.insertMessage(chatRoomId, fromUserId, toUserId, text, replyToMessageId);

            if (message.status === 200 || message.status === 201) {
                const message_id = message.id;
                let mediaData;
                for (const file of mediaFiles) {
                    try {
                        let mediaType;
                        let uploadPath;

                        // Determine media type based on file mimetype
                        switch (file.mimetype.split('/')[0]) {
                            case 'image':
                                mediaType = 'images';
                                break;
                            case 'video':
                                mediaType = 'videos';
                                break;
                            case 'audio':
                                mediaType = 'audios';
                                break;
                            default:
                                mediaType = 'others';
                        }

                        // Construct upload path based on media type
                        uploadPath = `${baseUrl}:${port}/uploads/posts/${mediaType}/${file.filename}`;

                        // Upload media to the media table
                        mediaData = await chatModel.uploadToMediaTable(chatRoomId, fromUserId, uploadPath, file.mimetype, message_id);
                        if (mediaData.status !== 201) {
                            throw new Error('Media upload failed');
                        }
                    } catch (error) {
                        console.error('Failed to upload media:', error);
                        return res.status(500).json({
                            status: 500,
                            error: 'Failed to upload media'
                        });
                    }
                }

                // Emit a socket event to notify clients about the new message
                io.emit('newMessage', { text: text, roomId: chatRoomId, messageId: message_id });

                const messageData = await chatModel.getMessageById(message_id);
                res.status(201).json({
                    status: 201,
                    message: 'Message sent successfully',
                    text: messageData.data || [],
                });

            } else {
                res.status(message.status).json({
                    status: message.status,
                    error: message.message || message.error || "Error inserting message"
                });
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

exports.getMessages = async (req, res) => {
    try {

        const chatRoomId = req.params.roomId;
        const fromUserId = req.user.id;
        const messages = await chatModel.getMessages(chatRoomId, fromUserId);

        if (messages.status === 200) {
            res.status(200).json({
                status: 200,
                data: messages.data || []
            });
        } else {
            res.status(messages.status).json({
                status: messages.status,
                message: messages.message || messages.error || "Error getting messages"
            })
        }
    } catch (error) {

    }
}

exports.getMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await chatModel.getMessageById(messageId);
        if (message.status === 200) {
            res.status(200).json({
                status: 200,
                data: message.data || {}
            });
        } else {
            res.status(message.status).json({
                status: message.status,
                message: message.message || message.error || "Error getting message"
            });
        }
    } catch (error) {
        console.error('Error getting message:', error);
        res.status(500).json({
            status: 500,
            error: error.message || 'Internal server error'
        });
    }
};

// controller function for updating a fuction 
exports.updateMessage = async (req, res) => {
    const userId = req.user.id
    const messageId = parseInt(req.params.messageId)
    const roomId = parseInt(req.params.roomId)

    const oldMessage = await chatModel.getMessageById(messageId)
    if (oldMessage.status !== 200) {
        return res.status(oldMessage.status).json({
            status: oldMessage.status,
            message: oldMessage.message || oldMessage.error || "Error getting message"
        });
    }

    if (oldMessage.data.message.from_user_id !== userId) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized, you cant edit this message.'
        });
    }

    if (oldMessage.data.message.chat_room_id !== roomId) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized, you cant update this message.'
        });
    }

    const { text } = req.body
    const message = await chatModel.updateMessage(messageId, text)

    if (message.status === 200) {
        res.status(200).json({
            status: 200,
            message: 'Message updated successfully'
        });
    }

}

exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const deletionResult = await chatModel.deleteMessage(messageId);

        if (deletionResult.status === 200) {
            res.status(200).json({
                status: 200,
                message: 'Message deleted successfully'
            });
        } else {
            res.status(deletionResult.status).json({
                status: deletionResult.status,
                error: deletionResult.message || deletionResult.error || "Error deleting message"
            });
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            status: 500,
            error: error.message || 'Internal server error'
        });
    }
};
