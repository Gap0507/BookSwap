
import { useState } from 'react';

const SearchFilters = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ location, genre, status });
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
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input flex-grow"
          />
          <button type="submit" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label htmlFor="location" className="label">Location</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
          >
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="Chicago">Chicago</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Boston">Boston</option>
            <option value="London">London</option>
          </select>
        </div>

        <div>
          <label htmlFor="genre" className="label">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="input"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Dystopian">Dystopian</option>
            <option value="Romance">Romance</option>
            <option value="Classic">Classic</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="label">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented/Exchanged</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button 
            onClick={handleFilter}
            className="btn btn-primary flex-1"
          >
            Apply Filters
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-outline"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
