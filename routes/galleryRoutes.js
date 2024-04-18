const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/verifyToken');
const galleryController = require('../controllers/galleryController');


router.post('/upload', authenticateToken, galleryController.uploadMedia);

module.exports = router;
