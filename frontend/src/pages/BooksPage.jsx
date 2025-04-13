import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import SearchFilters from '../components/SearchFilters';
import { booksAPI } from '../utils/api';

// Flag to determine if we should use client-side or server-side filtering
const USE_SERVER_FILTERING = false;

const BooksPage = () => {
  const { books, loading: booksLoading, error: booksError, fetchBooks } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    genre: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch of books
  useEffect(() => {
    fetchBooks();
  }, []);

  // For server-side filtering
  const fetchFilteredBooks = async () => {
    if (!USE_SERVER_FILTERING) return;
    
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) {
        // Add search term to params (can be title or author search)
        params.title = searchTerm;
      }
      if (filters.location) params.location = filters.location;
      if (filters.genre) params.genre = filters.genre;
      if (filters.status) params.status = filters.status;
      
      const response = await booksAPI.getAllBooks(params);
      if (response.success) {
        setFilteredBooks(response.books);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching filtered books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // For client-side filtering
  const filterBooksLocally = () => {
    if (USE_SERVER_FILTERING) return;
    
    let result = [...books];
    
    // Apply search term
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(lowercaseTerm) || 
        book.author.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(book => book.location === filters.location);
    }
    
    // Apply genre filter
    if (filters.genre) {
      result = result.filter(book => book.genre === filters.genre);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(book => book.status === filters.status);
    }
    
    setFilteredBooks(result);
  };

  // Update filtered books whenever books, search term, or filters change
  useEffect(() => {
    if (books.length > 0) {
      if (USE_SERVER_FILTERING) {
        fetchFilteredBooks();
      } else {
        filterBooksLocally();
      }
    }
  }, [books, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterOptions) => {
    setFilters(filterOptions);
  };

  const isLoading = booksLoading || loading;
  const displayError = error || booksError;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-spin w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Loading Books</h2>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch the books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          Browse Available Books
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover books shared by our community members and connect with fellow book lovers.
        </p>
      </div>
      
      <SearchFilters onSearch={handleSearch} onFilter={handleFilter} />
      
      {displayError && (
        <div className="text-center py-8 mb-4">
          <div className="glass-card p-6 max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">Error Loading Books</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {displayError}
            </p>
            <button 
              onClick={USE_SERVER_FILTERING ? fetchFilteredBooks : fetchBooks}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {!displayError && filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">No books found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search filters or check back later for new additions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id || book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
