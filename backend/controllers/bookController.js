const { Book } = require('../models');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { title, author, genre, location, status } = req.query;
    
    // Build query object
    const query = {};
    
    // Apply text search if title or author provided
    if (title || author) {
      const searchTerms = [];
      if (title) searchTerms.push(title);
      if (author) searchTerms.push(author);
      query.$text = { $search: searchTerms.join(' ') };
    }
    
    // Apply filters
    if (genre) query.genre = genre;
    if (location) query.location = location;
    if (status) query.status = status;
    
    const books = await Book.find(query)
      .populate('ownerId', 'name email mobile')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: books.length, books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('ownerId', 'name email mobile');
      
    if (book) {
      res.json({ success: true, book });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, genre, location, description, cover } = req.body;
    
    const book = await Book.create({
      title,
      author,
      genre,
      location,
      description,
      cover,
      ownerId: req.user.id
    });
    
    res.status(201).json({ success: true, book });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    // Check if user is the book owner
    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this book' });
    }
    
    // Update fields
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, book: updatedBook });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    // Check if user is the book owner
    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
    }
    
    await book.deleteOne();
    
    res.json({ success: true, message: 'Book removed' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update book status
// @route   PATCH /api/books/:id/status
// @access  Private
const updateBookStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['available', 'rented', 'unavailable'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    // Check if user is the book owner
    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this book status' });
    }
    
    book.status = status;
    await book.save();
    
    res.json({ success: true, book });
  } catch (error) {
    console.error('Update book status error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get books by owner ID
// @route   GET /api/books/owner/:userId
// @access  Public
const getBooksByOwner = async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.params.userId })
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: books.length, books });
  } catch (error) {
    console.error('Get books by owner error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  getBooksByOwner
}; 