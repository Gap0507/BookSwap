import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { toast } from 'react-hot-toast';
import RatingForm from './RatingForm';
import TrustScoreBadge from './TrustScoreBadge';

const TransactionCard = ({ transaction: initialTransaction, onUpdate }) => {
  const { currentUser } = useAuth();
  const { updateTransactionStatus } = useTransaction();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [transaction, setTransaction] = useState(initialTransaction);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isOwner = transaction.ownerId._id === currentUser.id;
  const otherUser = isOwner ? transaction.borrowerId : transaction.ownerId;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      const updatedTransaction = await updateTransactionStatus(transaction._id, newStatus);
      setTransaction(updatedTransaction);
      
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate();
      }
      
      const statusMessages = {
        approved: 'Request approved successfully',
        rejected: 'Request rejected',
        active: 'Exchange started',
        completed: 'Exchange completed',
        cancelled: 'Request cancelled'
      };
      toast.success(statusMessages[newStatus] || 'Status updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update request status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">{transaction.bookId.title}</h3>
          <div className="flex items-center mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mr-2">
              {isOwner ? 'Requested by: ' : 'Owned by: '}
              {otherUser.name}
            </p>
            {otherUser.trustScore && (
              <TrustScoreBadge score={otherUser.trustScore.trustScore} size="sm" />
            )}
          </div>
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
          {transaction.message && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Message: {transaction.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div>
          {transaction.status === 'requested' && isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('approved')}
                className="btn btn-sm btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                className="btn btn-sm btn-danger"
                disabled={isUpdating}
              >
                {isUpdating ? 'Processing...' : 'Reject'}
              </button>
            </div>
          )}

          {transaction.status === 'approved' && isOwner && (
            <button
              onClick={() => handleStatusUpdate('active')}
              className="btn btn-sm btn-success"
              disabled={isUpdating}
            >
              {isUpdating ? 'Processing...' : 'Start Exchange'}
            </button>
          )}

          {transaction.status === 'active' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              className="btn btn-sm btn-success"
              disabled={isUpdating}
            >
              {isUpdating ? 'Processing...' : 'Complete Exchange'}
            </button>
          )}

          {transaction.status === 'requested' && !isOwner && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="btn btn-sm btn-danger"
              disabled={isUpdating}
            >
              {isUpdating ? 'Processing...' : 'Cancel Request'}
            </button>
          )}
        </div>
      </div>
      
      {/* Rating Section */}
      {transaction.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showRatingForm ? (
            <div className="animate-fadeIn">
              <h4 className="text-sm font-medium mb-2">Rate {otherUser.name}</h4>
              <RatingForm 
                userId={otherUser._id} 
                transactionId={transaction._id}
                onRatingSubmitted={() => setShowRatingForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowRatingForm(true)}
              className="btn btn-sm btn-secondary"
            >
              Rate {otherUser.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;