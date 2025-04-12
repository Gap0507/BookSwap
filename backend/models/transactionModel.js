const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'requested'
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 