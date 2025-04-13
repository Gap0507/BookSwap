import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { toast } from 'react-hot-toast';

const TransactionCard = ({ transaction }) => {
  const { currentUser } = useAuth();
  const { updateTransactionStatus } = useTransaction();
  const isOwner = transaction.ownerId._id === currentUser.id;

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
    try {
      await updateTransactionStatus(transaction._id, newStatus);
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
    }
  };

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">{transaction.bookId.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isOwner ? 'Requested by: ' : 'Owned by: '}
            {isOwner ? transaction.borrowerId.name : transaction.ownerId.name}
          </p>
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
        {transaction.status === 'requested' && isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate('approved')}
              className="btn btn-sm btn-primary"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="btn btn-sm btn-danger"
            >
              Reject
            </button>
          </div>
        )}

        {transaction.status === 'approved' && isOwner && (
          <button
            onClick={() => handleStatusUpdate('active')}
            className="btn btn-sm btn-success"
          >
            Start Exchange
          </button>
        )}

        {transaction.status === 'active' && isOwner && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            className="btn btn-sm btn-success"
          >
            Complete Exchange
          </button>
        )}

        {transaction.status === 'requested' && !isOwner && (
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            className="btn btn-sm btn-danger"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard; 