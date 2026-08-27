import { verifyAccessToken } from '../utils/JwtUtils.js';

const authMiddleware = (req, res, next) => {
  // Get Authorization Header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access token required',
    });
  }

  // Extract Token
  const token = authHeader.split(' ')[1];

  try {
    // Verify Token
    const decoded = verifyAccessToken(token);

    // Store user details in request
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired access token',
    });
  }
};

export default authMiddleware;