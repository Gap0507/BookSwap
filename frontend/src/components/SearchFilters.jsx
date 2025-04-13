import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';

const SearchFilters = ({ onSearch, onFilter }) => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);

  // Extract unique locations and genres from books
  useEffect(() => {
    if (books.length > 0) {
      const locations = [...new Set(books.map(book => book.location))].filter(Boolean).sort();
      const genres = [...new Set(books.map(book => book.genre))].filter(Boolean).sort();
      setUniqueLocations(locations);
      setUniqueGenres(genres);
    }
  }, [books]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Immediately trigger search
  };

  // Handle filter changes
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onFilter({ location: value, genre, status }); // Immediately apply filter
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setGenre(value);
    onFilter({ location, genre: value, status }); // Immediately apply filter
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    onFilter({ location, genre, status: value }); // Immediately apply filter
  };

  const handleReset = () => {
    setSearchTerm('');
    setLocation('');
    setGenre('');
    setStatus('');
    onSearch('');
    onFilter({ location: '', genre: '', status: '' });
  };

  return (
    <div className="glass-card p-4 mb-6 animate-fadeIn">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label htmlFor="location" className="label">Location</label>
          <select
            id="location"
            value={location}
            onChange={handleLocationChange}
            className="input"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="genre" className="label">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={handleGenreChange}
            className="input"
          >
            <option value="">All Genres</option>
            {uniqueGenres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="label">Status</label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="input"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented/Exchanged</option>
          </select>
        </div>

        <div className="flex items-end">
          <button 
            onClick={handleReset}
            className="btn btn-outline w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
