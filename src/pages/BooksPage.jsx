
import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import SearchFilters from '../components/SearchFilters';

const BooksPage = () => {
  const { books } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    genre: '',
    status: ''
  });

  useEffect(() => {
    // Apply search and filters
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
  }, [books, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterOptions) => {
    setFilters(filterOptions);
  };

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
      
      {filteredBooks.length === 0 ? (
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
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
