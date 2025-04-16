const { Transaction, Book } = require('../models');

// @desc    Create a new transaction request
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { bookId, message } = req.body;
    
    // Find the book - using bookId directly
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    // Check if book is available
    if (book.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Book is not available for exchange' });
    }
    
    // Check if user is trying to borrow their own book
    if (book.ownerId.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot request your own book' });
    }
    
    // Check if there's already an active transaction for this book and user
    const existingTransaction = await Transaction.findOne({
      bookId,
      borrowerId: req.user.id,
      status: { $in: ['requested', 'approved', 'active'] }
    });
    
    if (existingTransaction) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have an active request for this book',
        transaction: existingTransaction
      });
    }
    
    // Create new transaction
    const transaction = await Transaction.create({
      bookId,
      ownerId: book.ownerId,
      borrowerId: req.user.id,
      message,
      status: 'requested'
    });
    
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get transactions for current user (as borrower or owner)
// @route   GET /api/transactions
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    // Find transactions where user is either borrower or owner
    const transactions = await Transaction.find({
      $or: [{ borrowerId: req.user.id }, { ownerId: req.user.id }]
    })
      .populate('bookId')
      .populate('ownerId', 'name email mobile')
      .populate('borrowerId', 'name email mobile')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('bookId')
      .populate('ownerId', 'name email mobile')
      .populate('borrowerId', 'name email mobile');
      
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    // Check if user is part of the transaction
    if (transaction.borrowerId._id.toString() !== req.user.id && 
        transaction.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this transaction' });
    }
    
    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



// @desc    Update transaction status
// @route   PATCH /api/transactions/:id/status
// @access  Private
const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['requested', 'approved', 'rejected', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    // Find the transaction
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    // Check if user is part of the transaction
    const isOwner = transaction.ownerId.toString() === req.user.id;
    const isBorrower = transaction.borrowerId.toString() === req.user.id;
    
    if (!isOwner && !isBorrower) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this transaction' });
    }
    
    // Validate status transitions
    const validTransitions = {
      requested: ['approved', 'rejected', 'cancelled'],
      approved: ['active', 'cancelled', 'rejected'],
      active: ['completed', 'cancelled'],
      completed: [],
      rejected: [],
      cancelled: []
    };
    
    if (!validTransitions[transaction.status].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot transition from ${transaction.status} to ${status}` 
      });
    }
    
    // Additional validation based on user role
    if ((status === 'rejected' || status === 'approved' || status === 'active') && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the book owner can perform this action' 
      });
    }
    
    if (status === 'cancelled' && !isBorrower) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the borrower can cancel the request' 
      });
    }
    
    // Update transaction status
    transaction.status = status;
    
    // Set start/end dates for active and completed transactions
    if (status === 'active') {
      transaction.startDate = new Date();
    } else if (status === 'completed') {
      transaction.endDate = new Date();
    }
    
    await transaction.save();
    
    // Update book status based on transaction status
    const book = await Book.findById(transaction.bookId);
    
    if (book) {
      if (status === 'active') {
        book.status = 'rented';
      } else if (status === 'completed' || status === 'cancelled' || status === 'rejected') {
        book.status = 'available';
      }
      
      await book.save();
    }
    
    // Populate the transaction data
    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('bookId')
      .populate('ownerId', 'name email mobile')
      .populate('borrowerId', 'name email mobile');
    
    res.json({ success: true, transaction: updatedTransaction });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


module.exports = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  updateTransactionStatus
}; 