import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication middleware.
 * Extracts JWT from the Authorization header (Bearer <token>) or from the 'token' cookie.
 * Verifies the token, finds the user, and attaches them to req.user.
 */
const auth = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback to cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from decoded payload, exclude password
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized — user not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized — token is invalid',
    });
  }
};

export default auth;
