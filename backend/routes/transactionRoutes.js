const express = require('express');
const { 
  createTransaction, 
  getMyTransactions, 
  getTransactionById, 
  updateTransactionStatus 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All transaction routes are protected
router.use(protect);

router.post('/', createTransaction);
router.get('/', getMyTransactions);
router.get('/:id', getTransactionById);
router.patch('/:id/status', updateTransactionStatus);

module.exports = router; 