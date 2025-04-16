import { createContext, useContext, useState, useEffect } from 'react';
import { transactionsAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions when user is logged in
  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser]);

  const fetchTransactions = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await transactionsAPI.getMyTransactions();
      if (response.success) {
        setTransactions(response.transactions);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fix: Modified to accept a transaction object with bookId and message properties
  const createTransaction = async (transactionData) => {
    try {
      const response = await transactionsAPI.createTransaction(transactionData);
      if (response.success) {
        // Add the new transaction to the state
        setTransactions([response.transaction, ...transactions]);
        return response.transaction;
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  const updateTransactionStatus = async (transactionId, status) => {
    try {
      const response = await transactionsAPI.updateTransactionStatus(transactionId, status);
      if (response.success) {
        // Update the transaction in the state with the complete updated transaction data
        setTransactions(transactions.map(t => 
          t._id === transactionId ? response.transaction : t
        ));
        return response.transaction;
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        fetchTransactions,
        createTransaction,
        updateTransactionStatus
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};