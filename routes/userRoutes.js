const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require("../controllers/authController")
const authenticateToken = require('../middlewares/verifyToken');
const handleDefaultRoute = require("../middlewares/handleDefaultRoute")

router.get('/', authenticateToken, handleDefaultRoute)

router.post('/register/step_1', authController.register);

router.post("/register/step_2", authenticateToken, userController.stepTwo)

router.post("/register/step_3", authenticateToken, userController.stepThree)

router.post('/login', authController.login);

router.post("/logout", authController.logout)

router.get('/profile', authenticateToken, userController.getLoggedInUser);

module.exports = router;
