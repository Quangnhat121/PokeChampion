import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register — create a new user
router.post('/register', register);

// POST /api/auth/login — authenticate & get token
router.post('/login', login);

// GET /api/auth/me — get currently logged-in user (protected)
router.get('/me', auth, getMe);

export default router;
