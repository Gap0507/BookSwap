import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { booksAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const BookContext = createContext();

// Flag to determine if we're using the backend API or local storage
const USE_BACKEND_API = true;

// Export the context provider component first
export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      if (USE_BACKEND_API) {
        const response = await booksAPI.getAllBooks();
        if (response.success) {
          setBooks(response.books);
        } else {
          throw new Error(response.message || 'Failed to fetch books');
        }
      } else {
        // Fallback to localStorage
        const savedBooks = getFromLocalStorage('books', []);
        setBooks(savedBooks);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
      
      // Fallback to localStorage on API failure
      const savedBooks = getFromLocalStorage('books', []);
      setBooks(savedBooks);
    } finally {
      setLoading(false);
    }
  };

  // Load books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Add a new book
  const addBook = async (bookData) => {
    try {
      if (USE_BACKEND_API && isAuthenticated) {
        const response = await booksAPI.createBook(bookData);
        if (response.success) {
          setBooks(prevBooks => [...prevBooks, response.book]);
          return response.book;
        } else {
          throw new Error(response.message || 'Failed to add book');
        }
      } else {
        // Fallback to localStorage
        const newBook = {
          ...bookData,
          id: Date.now().toString(),
          status: 'available',
        };
        
        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        saveToLocalStorage('books', updatedBooks);
        
        return newBook;
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message);
      
      // On failure, still attempt to save to localStorage
      if (!USE_BACKEND_API || !isAuthenticated) {
        const newBook = {
          ...bookData,
          id: Date.now().toString(),
          status: 'available',
        };
        
        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        saveToLocalStorage('books', updatedBooks);
        
        return newBook;
      }
      throw err;
    }
  };

  // Update book status
  const updateBookStatus = async (bookId, status) => {
    try {
      if (USE_BACKEND_API && isAuthenticated) {
        const response = await booksAPI.updateBookStatus(bookId, status);
        if (response.success) {
          setBooks(prevBooks => 
            prevBooks.map(book => book.id === bookId ? response.book : book)
          );
        } else {
          throw new Error(response.message || 'Failed to update book status');
        }
      } else {
        // Fallback to localStorage
        const updatedBooks = books.map(book => 
          book.id === bookId ? { ...book, status } : book
        );
        
        setBooks(updatedBooks);
        saveToLocalStorage('books', updatedBooks);
      }
    } catch (err) {
      console.error('Error updating book status:', err);
      setError(err.message);
      
      // On API failure, update in localStorage anyway
      const updatedBooks = books.map(book => 
        book.id === bookId ? { ...book, status } : book
      );
      
      setBooks(updatedBooks);
      saveToLocalStorage('books', updatedBooks);
    }
  };

  // Delete a book
  const deleteBook = async (bookId) => {
    try {
      if (USE_BACKEND_API && isAuthenticated) {
        const response = await booksAPI.deleteBook(bookId);
        if (response.success) {
          setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        } else {
          throw new Error(response.message || 'Failed to delete book');
        }
      } else {
        // Fallback to localStorage
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
        saveToLocalStorage('books', updatedBooks);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err.message);
      
      // On API failure, delete from localStorage anyway
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
      saveToLocalStorage('books', updatedBooks);
    }
  };

  // Get books by owner
  const getBooksByOwner = async (ownerId) => {
    try {
      if (USE_BACKEND_API) {
        const response = await booksAPI.getBooksByOwner(ownerId);
        if (response.success) {
          return response.books;
        } else {
          throw new Error(response.message || 'Failed to get books by owner');
        }
      } else {
        // Fallback to filtering local books
        return books.filter(book => book.ownerId === ownerId);
      }
    } catch (err) {
      console.error('Error getting books by owner:', err);
      setError(err.message);
      
      // Fallback to filtering local books on API failure
      return books.filter(book => book.ownerId === ownerId);
    }
  };

  // Get book by ID
  const getBookById = async (bookId) => {
    try {
      if (USE_BACKEND_API) {
        const response = await booksAPI.getBookById(bookId);
        if (response.success) {
          return response.book;
        } else {
          throw new Error(response.message || 'Failed to get book');
        }
      } else {
        // Fallback to finding the book locally
        return books.find(book => book.id === bookId);
      }
    } catch (err) {
      console.error('Error getting book by id:', err);
      setError(err.message);
      
      // Fallback to finding the book locally on API failure
      return books.find(book => book.id === bookId);
    }
  };

  const value = {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
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
  return useContext(BookContext);
};
