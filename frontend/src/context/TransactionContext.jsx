import { createContext, useContext, useState } from 'react';
import { transactionsAPI } from '../utils/api';

const TransactionContext = createContext();

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new transaction request
  const createTransaction = async (data) => {
    setLoading(true);
    try {
      const response = await transactionsAPI.createTransaction(data);
      if (response.success) {
        setTransactions(prev => [response.transaction, ...prev]);
        return response.transaction;
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all transactions for current user
  const fetchMyTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getMyTransactions();
      if (response.success) {
        setTransactions(response.transactions);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId, status) => {
    setLoading(true);
    try {
      const response = await transactionsAPI.updateTransactionStatus(transactionId, status);
      if (response.success) {
        setTransactions(prev => 
          prev.map(t => t._id === transactionId ? response.transaction : t)
        );
        return response.transaction;
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      loading,
      error,
      createTransaction,
      fetchMyTransactions,
      updateTransactionStatus
    }}>
      {children}
    </TransactionContext.Provider>
  );
}; 