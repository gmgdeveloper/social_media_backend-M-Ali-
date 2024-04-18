const galleryModel = require('../models/Gallery');
const multer = require('multer');
const path = require('path');
const env = require("dotenv");
const { error } = require('console');
env.config();

const baseUrl = process.env.BASE_URL || 'http://localhost';
const port = process.env.PORT || 8000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith('image');
        const isVideo = file.mimetype.startsWith('video');

        let destPath = './public/uploads/gallery/';

        if (isImage) {
            destPath += 'images/';
        } else if (isVideo) {
            destPath += 'videos/';
        } else {
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
        checkFileType(file, cb);
    }
}).array('media', 15);

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|mp4/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and videos only (JPEG, JPG, PNG, MP4)');
    }
}

exports.uploadMedia = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ status: 400, error: err.message });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
            }

            const { description } = req.body;
            const mediaFiles = req.files.map(file => {
                let mediaType, mediaUrl;
            
                if (file.mimetype.startsWith('image')) {
                    mediaType = 'image';
                    mediaUrl = `${baseUrl}:${port}/uploads/gallery/images/${file.filename}`;
                } else if (file.mimetype.startsWith('video')) {
                    mediaType = 'video';
                    mediaUrl = `${baseUrl}:${port}/uploads/gallery/videos/${file.filename}`;
                }
            
                return { url: mediaUrl, type: file.mimetype, mediaType };
            });
            
            const fileUpload = await galleryModel.uploadMedia(req.user.id, description, mediaFiles);

            if (fileUpload.status === 201) {
                return res.status(201).json({ status: 201, message: 'Media uploaded successfully' });
            } else {
                return res.status(fileUpload.status).json({ status: fileUpload.status, error: fileUpload.error });
            }
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};
