import express from 'express';
import { body } from 'express-validator';
import { checkAdmin, setupAdmin, login, refreshToken, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Check if admin exists
router.get('/check-admin', checkAdmin);

// Setup first admin
router.post(
    '/setup',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        validate,
    ],
    setupAdmin
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
        validate,
    ],
    login
);

// Refresh token
router.post('/refresh', refreshToken);

// Get current user
router.get('/me', protect, getMe);

export default router;
