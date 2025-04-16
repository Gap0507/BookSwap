const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['owner', 'seeker'],
    default: 'seeker'
  },
  // Add fields for trust score components
  ratings: [{
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate trust score
userSchema.methods.calculateTrustScore = async function(role = null) {
  // If role is not provided, use the user's role
  const userRole = role || this.role;
  
  // Get all transactions where user is either owner or borrower
  const Transaction = mongoose.model('Transaction');
  
  let completedTransactions = 0;
  let cancelledTransactions = 0;
  
  if (userRole === 'owner') {
    // For owners: count transactions where user is the owner
    const ownerTransactions = await Transaction.find({ ownerId: this._id });
    completedTransactions = ownerTransactions.filter(t => t.status === 'completed').length;
    cancelledTransactions = ownerTransactions.filter(t => t.status === 'rejected').length;
  } else {
    // For borrowers: count transactions where user is the borrower
    const borrowerTransactions = await Transaction.find({ borrowerId: this._id });
    completedTransactions = borrowerTransactions.filter(t => t.status === 'completed').length;
    cancelledTransactions = borrowerTransactions.filter(t => t.status === 'cancelled').length;
  }
  
  // Calculate average rating
  let averageRating = 0;
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((total, rating) => total + rating.score, 0);
    averageRating = sum / this.ratings.length;
  }
  
  // Calculate trust score components
  const ratingScore = (averageRating / 5) * 50; // 50% weight for ratings (scale 0-5)
  const transactionScore = Math.min(completedTransactions * 5, 30); // 30% weight for completed transactions (cap at 30)
  const cancellationPenalty = Math.min(cancelledTransactions * 5, 20); // 20% negative weight for cancellations
  
  // Calculate final score
  let trustScore = ratingScore + transactionScore - cancellationPenalty;
  
  // Clamp between 0 and 100
  trustScore = Math.max(0, Math.min(100, trustScore));
  
  return {
    trustScore: Math.round(trustScore),
    averageRating,
    completedTransactions,
    cancelledTransactions,
    components: {
      ratingScore: Math.round(ratingScore),
      transactionScore: Math.round(transactionScore),
      cancellationPenalty: Math.round(cancellationPenalty)
    }
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;