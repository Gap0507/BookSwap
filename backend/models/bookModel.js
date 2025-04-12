const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  cover: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'unavailable'],
    default: 'available'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add index for text search on title and author
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 