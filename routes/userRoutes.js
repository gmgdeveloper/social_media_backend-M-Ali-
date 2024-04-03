const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require("../controllers/authController")
const authenticateToken = require('../middlewares/verifyToken');
const handleDefaultRoute = require("../middlewares/handleDefaultRoute")


// Default route
router.get('/', authenticateToken, handleDefaultRoute)

// Route for user registration
router.post('/register/step_1', authController.register);

// Route to update users bio as step 2 (protected route)
router.post("/register/step_2", authenticateToken, userController.stepTwo)

// Route to update users bio as step 2 (protected route)
router.post("/register/step_3", authenticateToken, userController.uploadUserProfilePic)

// Route for user login
router.post('/login', authController.login);

// Route for user logout
router.post("/logout", authController.logout)

// Route to get user (protected route)
router.get('/profile', authenticateToken, userController.getLoggedInUser);

module.exports = router;
