const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getUserById,
  rateUser,
  checkRating,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users/:id', getUserById);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/users/:id/rate', protect, rateUser);
router.post('/users/:id/ratings/check', protect, checkRating);

module.exports = router;