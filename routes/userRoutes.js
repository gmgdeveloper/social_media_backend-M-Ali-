const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require("../controllers/authController")
const authenticateToken = require('../middlewares/verifyToken');
const handleDefaultRoute = require("../middlewares/handleDefaultRoute")


// Default route
router.get('/', authenticateToken, handleDefaultRoute)

// Route for user registration
router.post('/register', authController.register);


// Route for user login
router.post('/login', authController.login);

// Route for user logout
router.post("/logout", authController.logout)


// Route to update users bio as step 2 (protected route)
router.post("/register/step_2", authenticateToken, userController.submitBio)


// Route to update users bio as step 2 (protected route)
router.post("/register/step_3", authenticateToken, userController.uploadUserProfilePic)

// Route to get user (protected route)
router.get('/user', authenticateToken, userController.getSingleUser);


// Route for user registration
// router.get('/register', (req, res) => {
//     res.json({
//         status: 200,
//         success: true,
//         message: 'Please enter register details'
//     })
// });


// Route for user login
// router.get('/login', (req, res) => {
//     res.json({
//         status: 200,
//         success: true,
//         message: 'Please enter login details'
//     })
// });


module.exports = router;
