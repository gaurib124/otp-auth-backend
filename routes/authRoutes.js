const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.get('/refresh-token', authController.refreshToken);

// Protected
router.get('/protected', authMiddleware, authController.protectedRoute);

module.exports = router;
