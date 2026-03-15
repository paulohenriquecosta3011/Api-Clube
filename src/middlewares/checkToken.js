// checkToken.js
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

function checkToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token not provided', 401, 'TOKEN_NOT_PROVIDED', true);
    }

    const token = authHeader.split(' ')[1];

    // Verifies and decodes the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validates that the payload contains tipo_user
    if (!decoded || !decoded.tipo_user) {
      throw new AppError('Malformed or invalid token', 401, 'TOKEN_INVALID', true);
    }

    // Attaches the decoded user to req for downstream usage
    req.user = decoded;

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expired
      return res.status(401).json({
        status: 'fail',
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      // Invalid token (signature, format, etc)
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token',
        code: 'TOKEN_INVALID',
      });
    }

    // If it's an AppError, use its message and status
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
        code: error.code,
      });
    }

    // Unexpected error
    console.error('Error in middleware checkToken:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}

export default checkToken;