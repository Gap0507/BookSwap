const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID from token and exclude password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// Middleware to check if user has owner role
const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized, owner access required'
    });
  }
};

// Middleware to check if user has seeker role
const isSeeker = (req, res, next) => {
  if (req.user && req.user.role === 'seeker') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized, seeker access required'
    });
  }
};

module.exports = { protect, isOwner, isSeeker }; 