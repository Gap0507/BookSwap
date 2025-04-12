
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

const BookCard = ({ book }) => {
  const { id, title, author, genre, location, status, cover, description } = book;
  const { currentUser, isOwner } = useAuth();
  const { updateBookStatus, deleteBook } = useBooks();
  const [isExpanded, setIsExpanded] = useState(false);

  const isUserBook = currentUser && isOwner && book.ownerId === currentUser.id;

  const handleStatusToggle = () => {
    const newStatus = status === 'available' ? 'rented' : 'available';
    updateBookStatus(id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="glass-card overflow-hidden animate-fadeIn card-hover">
      <div className="relative">
        <img 
          src={cover || "https://source.unsplash.com/random/400x600/?book"} 
          alt={title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            status === 'available' 
              ? 'bg-green-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {status === 'available' ? 'Available' : 'Rented/Exchanged'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-serif font-bold mb-1 truncate">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{author}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {genre && (
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 text-xs rounded-full">
              {genre}
            </span>
          )}
          <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-100 text-xs rounded-full">
            {location}
          </span>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-16'}`}>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {description || "No description available for this book."}
          </p>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 dark:text-primary-400 text-sm mt-2 hover:underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/books/${id}`} className="btn btn-outline text-sm flex-1">
            View Details
          </Link>
          
          {isUserBook && (
            <>
              <button 
                onClick={handleStatusToggle}
                className={`btn text-sm flex-1 ${
                  status === 'available' 
                    ? 'btn-amber' 
                    : 'btn-secondary'
                }`}
              >
                Mark as {status === 'available' ? 'Rented' : 'Available'}
              </button>
              
              <button 
                onClick={handleDelete}
                className="btn text-sm flex-shrink-0 bg-red-500 hover:bg-red-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
