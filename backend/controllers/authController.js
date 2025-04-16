const jwt = require('jsonwebtoken');
const { User, Transaction } = require('../models');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      role
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Get user and populate ratings.fromUser with name
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'ratings.fromUser',
        select: 'name' // Only get name of the rating user
      });
    
    if (user) {
      // Calculate trust score
      const trustScoreData = await user.calculateTrustScore();
      
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          trustScore: trustScoreData,
          ratings: user.ratings
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/auth/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    // Get user and populate ratings.fromUser with name
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate({
        path: 'ratings.fromUser',
        select: 'name' // Only get name of the rating user
      });
    
    if (user) {
      // Calculate trust score
      const trustScoreData = await user.calculateTrustScore();
      
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          role: user.role,
          trustScore: trustScoreData,
          ratings: user.ratings
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Rate a user
// @route   POST /api/auth/users/:id/rate
// @access  Private
const rateUser = async (req, res) => {
  try {
    const { score, comment, transactionId } = req.body;
    
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: 'Rating score must be between 1 and 5' });
    }
    
    // Find the user to rate
    const userToRate = await User.findById(req.params.id);
    if (!userToRate) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify the transaction exists and involves both users
    if (transactionId) {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Check if the current user is part of the transaction
      const isOwner = transaction.ownerId.toString() === req.user.id;
      const isBorrower = transaction.borrowerId.toString() === req.user.id;
      
      if (!isOwner && !isBorrower) {
        return res.status(403).json({ success: false, message: 'You are not part of this transaction' });
      }
      
      // Check if the user being rated is part of the transaction
      const isRatedUserOwner = transaction.ownerId.toString() === req.params.id;
      const isRatedUserBorrower = transaction.borrowerId.toString() === req.params.id;
      
      if (!isRatedUserOwner && !isRatedUserBorrower) {
        return res.status(403).json({ success: false, message: 'The user being rated is not part of this transaction' });
      }
      
      // Check if transaction is completed
      if (transaction.status !== 'completed') {
        return res.status(400).json({ success: false, message: 'Can only rate users after transaction is completed' });
      }
    }
    
    // Add the rating
    userToRate.ratings.push({
      score,
      comment,
      fromUser: req.user.id,
      transactionId,
      createdAt: new Date()
    });
    
    await userToRate.save();
    
    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate user error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Check if user has already rated another user for a transaction
// @route   POST /api/auth/users/:id/ratings/check
// @access  Private
const checkRating = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const userId = req.params.id;
    
    // Find the user to check
    const userToCheck = await User.findById(userId);
    if (!userToCheck) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify the transaction exists
    if (transactionId) {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
    }
    
    // Check if the current user has already rated this user for this transaction
    const existingRating = userToCheck.ratings.find(
      rating => 
        rating.fromUser.toString() === req.user.id && 
        (!transactionId || rating.transactionId.toString() === transactionId)
    );
    
    if (existingRating) {
      return res.json({ 
        success: true, 
        hasRated: true, 
        rating: {
          score: existingRating.score,
          comment: existingRating.comment,
          createdAt: existingRating.createdAt
        }
      });
    }
    
    return res.json({ success: true, hasRated: false });
  } catch (error) {
    console.error('Check rating error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    
    // Save updated user
    const updatedUser = await user.save();
    
    // Calculate trust score
    const trustScoreData = await updatedUser.calculateTrustScore();
    
    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        trustScore: trustScoreData,
        ratings: updatedUser.ratings
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserById,
  rateUser,
  checkRating,
  updateUserProfile
};