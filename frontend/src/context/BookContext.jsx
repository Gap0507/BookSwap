import { createContext, useContext, useState, useEffect } from 'react';
import { booksAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const BookContext = createContext();

// Export the context provider component first
export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch all books
  const fetchBooks = async () => {
    if (authLoading) return;
    setLoading(true);
    try {
      const response = await booksAPI.getAllBooks();
      if (response.success) {
        setBooks(response.books);
      } else {
        throw new Error(response.message || 'Failed to fetch books');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load books on mount
  useEffect(() => {
    if (!authLoading) {
      fetchBooks();
    }
  }, [authLoading]);

  // Add a new book
  const addBook = async (bookData) => {
    try {
      if (isAuthenticated) {
        const response = await booksAPI.createBook(bookData);
        if (response.success) {
          setBooks(prevBooks => [...prevBooks, response.book]);
          return response.book;
        } else {
          throw new Error(response.message || 'Failed to add book');
        }
      } else {
        throw new Error('Authentication required to add a book');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update book status
  const updateBookStatus = async (bookId, status) => {
    try {
      if (isAuthenticated) {
        const response = await booksAPI.updateBookStatus(bookId, status);
        if (response.success) {
          setBooks(prevBooks => 
            prevBooks.map(book => book.id === bookId ? response.book : book)
          );
        } else {
          throw new Error(response.message || 'Failed to update book status');
        }
      } else {
        throw new Error('Authentication required to update book status');
      }
    } catch (err) {
      console.error('Error updating book status:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete a book
  const deleteBook = async (bookId) => {
    try {
      if (isAuthenticated) {
        const response = await booksAPI.deleteBook(bookId);
        if (response.success) {
          setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        } else {
          throw new Error(response.message || 'Failed to delete book');
        }
      } else {
        throw new Error('Authentication required to delete a book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get books by owner
  const getBooksByOwner = async (ownerId) => {
    try {
      const response = await booksAPI.getBooksByOwner(ownerId);
      if (response.success) {
        return response.books;
      } else {
        throw new Error(response.message || 'Failed to get books by owner');
      }
    } catch (err) {
      console.error('Error getting books by owner:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get book by ID
  const getBookById = async (bookId) => {
    try {
      const response = await booksAPI.getBookById(bookId);
      if (response.success) {
        return response.book;
      } else {
        throw new Error(response.message || 'Failed to get book');
      }
    } catch (err) {
      console.error('Error getting book by id:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update a book
  const updateBook = async (id, bookData) => {
    try {
      if (isAuthenticated) {
        const response = await booksAPI.updateBook(id, bookData);
        if (response.success) {
          setBooks(prevBooks => 
            prevBooks.map(book => book.id === id ? response.book : book)
          );
          return response.book;
        } else {
          throw new Error(response.message || 'Failed to update book');
        }
      } else {
        throw new Error('Authentication required to update a book');
      }
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    updateBookStatus,
    deleteBook,
    getBooksByOwner,
    getBookById,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

// Export the hook after the component
export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
