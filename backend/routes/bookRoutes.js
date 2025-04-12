const express = require('express');
const { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  updateBookStatus,
  getBooksByOwner
} = require('../controllers/bookController');
const { protect, isOwner } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/owner/:userId', getBooksByOwner);

// Protected routes for any authenticated user
router.post('/', protect, upload.single('cover'), createBook);

// Protected routes that require owner role or book ownership
router.put('/:id', protect, upload.single('cover'), updateBook);
router.delete('/:id', protect, deleteBook);
router.patch('/:id/status', protect, updateBookStatus);

module.exports = router; 