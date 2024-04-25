const chatModel = require('../models/Chat')
const multer = require('multer');
const path = require('path');
const env = require("dotenv")
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

// controller function to handle sending messages
exports.sendMessage = async (req, res) => {
    try {
        // Handle file uploads (if any)
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

            const chatRoomId = req.params.roomId
            // Extract message data from request
            const { text, toUserId, } = req.body;
            const replyToMessageId = req.body.replyToMessageId || null;
            const mediaFiles = req.files || []; // Array of uploaded media files, empty array if no files uploaded

            // Array to store media URLs
            const mediaUrls = [];

            // Upload media files and insert their information into the media table
            for (const file of mediaFiles) {
                try {
                    // Generate media URL based on file type
                    const mediaType = file.mimetype.startsWith('image') ? 'images' : 'videos';
                    const mediaUrl = `${baseUrl}:${port}/uploads/posts/${mediaType}/${file.filename}`;

                    // Push media URL to the array
                    mediaUrls.push(mediaUrl);

                    // Upload media to the media table
                    const mediaId = await chatModel.uploadToMediaTable(chatRoomId, fromUserId, mediaUrl, file.mimetype);
                } catch (error) {
                    console.error('Failed to upload media:', error);
                    return res.status(500).json({
                        status: 500,
                        error: 'Failed to upload media'
                    });
                }
            }
            // Insert the message into the database
            const message = await chatModel.insertMessage(chatRoomId, fromUserId, toUserId, text, replyToMessageId);

            // Handle the response from the message model
            if (message.status === 200 || message.status === 201) {
                res.status(201).json({
                    status: 201,
                    message: message.message || 'Message sent successfully',
                    text: message.data.data || [],
                });
            } else {
                res.status(message.status).json({
                    status: message.status,
                    error: message.message || message.error || "error inserting message"
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
