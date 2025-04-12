
import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load books from localStorage
    const savedBooks = getFromLocalStorage('books', []);
    setBooks(savedBooks);
    setLoading(false);
  }, []);

  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      status: 'available',
    };
    
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    saveToLocalStorage('books', updatedBooks);
    
    return newBook;
  };

  const updateBookStatus = (bookId, status) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, status } : book
    );
    
    setBooks(updatedBooks);
    saveToLocalStorage('books', updatedBooks);
  };

  const deleteBook = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
    saveToLocalStorage('books', updatedBooks);
  };

  const getBooksByOwner = (ownerId) => {
    return books.filter(book => book.ownerId === ownerId);
  };

  const getBookById = (bookId) => {
    return books.find(book => book.id === bookId);
  };

  const value = {
    books,
    loading,
    addBook,
    updateBookStatus,
    deleteBook,
    getBooksByOwner,
    getBookById,
  };

  return (
    <BookContext.Provider value={value}>
      {!loading && children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  return useContext(BookContext);
};
