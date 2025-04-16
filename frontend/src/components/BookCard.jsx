import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { authAPI } from '../utils/api';
import TrustScoreBadge from './TrustScoreBadge';

// API base URL for resolving image paths
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace('/api', ''); // Remove '/api' from the URL

// Function to resolve image path
const getImageUrl = (coverPath) => {
  if (!coverPath) return "https://source.unsplash.com/random/400x600/?book";
  
  // If it's a full URL or data URL, use it directly
  if (coverPath.startsWith('http') || coverPath.startsWith('data:')) {
    return coverPath;
  }
  
  // Otherwise, it's a relative path from the server
  return `${BASE_URL}${coverPath}`;
};

const BookCard = ({ book }) => {
  // Support both MongoDB _id and local storage id
  const bookId = book._id || book.id;
  const { title, author, genre, location, status, cover, description } = book;
  const { currentUser, isOwner, isAuthenticated } = useAuth();
  const { updateBookStatus, deleteBook, updateBook } = useBooks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedBook, setEditedBook] = useState({
    title: title,
    author: author,
    genre: genre,
    location: location,
    description: description,
  });
  const [previewUrl, setPreviewUrl] = useState(cover ? getImageUrl(cover) : '');
  const [editError, setEditError] = useState('');
  
  // New state for owner data
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if this is user's book, supporting both local and API data structures
  const isUserBook = currentUser && isOwner && 
    (book.ownerId === currentUser.id || 
     (book.ownerId && book.ownerId._id === currentUser.id) ||
     (book.ownerId && typeof book.ownerId === 'string' && book.ownerId === currentUser.id));

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rented':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Fetch owner data if needed
  useEffect(() => {
    // If the book has an ownerId object with all the data we need
    if (book.ownerId && typeof book.ownerId === 'object' && book.ownerId._id) {
      setOwner(book.ownerId);
    } 
    // If we only have the owner ID, fetch the owner data
    else if (book.ownerId && typeof book.ownerId === 'string') {
      const fetchOwner = async () => {
        setLoading(true);
        try {
          const response = await authAPI.getUserById(book.ownerId);
          if (response.success) {
            setOwner(response.user);
          }
        } catch (error) {
          console.error('Error fetching book owner:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOwner();
    }
  }, [book]);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = status === 'available' ? 'rented' : 'available';
      await updateBookStatus(bookId, newStatus);
      book.status = newStatus; // Update the local book state
      toast.success(`Book marked as ${newStatus}`);
    } catch (error) {
      console.error('Failed to update book status:', error);
      toast.error('Failed to update book status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBook(bookId);
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast.error('Failed to delete book. Please try again.');
      setIsDeleting(false);
    }
    setShowDeleteConfirm(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setEditedBook(prev => ({ ...prev, coverFile: file }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setIsUpdating(true);

    try {
      const updatedBook = await updateBook(bookId, editedBook);
      Object.assign(book, updatedBook);
      setShowEditModal(false);
      toast.success('Book updated successfully');
    } catch (error) {
      console.error('Failed to update book:', error);
      setEditError('Failed to update book. Please try again.');
      toast.error('Failed to update book. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="glass-card overflow-hidden animate-fadeIn p-8 text-center">
        <div className="animate-spin w-8 h-8 mx-auto text-primary-600 dark:text-primary-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p>Deleting book...</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fadeIn card-hover">
      <div className="relative">
        <img 
          src={getImageUrl(cover)} 
          alt={title}
          className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-900"
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
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-serif font-bold truncate flex-1">{title}</h3>
          {isUserBook && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 p-1 -mt-1 -mr-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          )}
        </div>
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
        
        {/* Owner info with trust score */}
        {owner && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                {owner.name ? owner.name.charAt(0) : '?'}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                {owner.name || 'Unknown'}
              </span>
            </div>
            
            {owner.trustScore && (
              <TrustScoreBadge score={owner.trustScore.trustScore} size="sm" />
            )}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {isAuthenticated ? (
            <Link to={`/books/${bookId}`} className="btn btn-outline text-sm flex-1">
              View Details
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline text-sm flex-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">
              Login/Signup to View Details
            </Link>
          )}
          
          {isUserBook && (
            <>
              <button 
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className={`btn text-sm flex-1 ${
                  status === 'available' 
                    ? 'btn-amber' 
                    : 'btn-secondary'
                } ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  `Mark as ${status === 'available' ? 'Rented' : 'Available'}`
                )}
              </button>
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting || isUpdating}
                className={`btn text-sm flex-shrink-0 bg-red-500 hover:bg-red-600 text-white ${
                  (isDeleting || isUpdating) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Move modals to portal */}
      {(showDeleteConfirm || showEditModal) && createPortal(
        <>
          {/* Delete Confirmation Popup */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Delete Confirmation</h3>
                <p className="mb-6">Are you sure you want to delete "{title}"?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Edit Book</h3>
                {editError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {editError}
                  </div>
                )}
                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label htmlFor="title" className="label">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editedBook.title}
                        onChange={handleEditInputChange}
                        className="input"
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="author" className="label">
                        Author <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={editedBook.author}
                        onChange={handleEditInputChange}
                        className="input"
                        placeholder="Enter author name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="genre" className="label">
                        Genre
                      </label>
                      <select
                        id="genre"
                        name="genre"
                        value={editedBook.genre}
                        onChange={handleEditInputChange}
                        className="input"
                      >
                        <option value="">Select a genre</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Motivational">Motivational</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Dystopian">Dystopian</option>
                        <option value="Romance">Romance</option>
                        <option value="Classic">Classic</option>
                        <option value="Non-fiction">Non-fiction</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Biography">Biography</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="label">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editedBook.location}
                        onChange={handleEditInputChange}
                        className="input"
                        placeholder="Enter your city/location"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label htmlFor="description" className="label">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editedBook.description}
                        onChange={handleEditInputChange}
                        className="input h-32"
                        placeholder="Enter a brief description of the book"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="cover" className="label">
                        Book Cover
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 btn btn-outline flex items-center justify-center gap-2 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                          Change Image
                          <input
                            type="file"
                            id="cover"
                            name="cover"
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        
                        {previewUrl && (
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowEditModal(false)}
                      className="btn btn-outline"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-8"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
};

export default BookCard;