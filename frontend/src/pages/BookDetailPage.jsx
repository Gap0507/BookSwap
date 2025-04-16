import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { toast } from 'react-hot-toast';

// API base URL for resolving image paths
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace('/api', ''); // Remove '/api' from the URL

const BookDetailPage = () => {
  const { id } = useParams();
  const { getBookById, updateBookStatus, deleteBook } = useBooks();
  const { currentUser, isOwner, isAuthenticated } = useAuth();
  const { createTransaction } = useTransaction();
  const [book, setBook] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const foundBook = await getBookById(id);
        
        if (foundBook) {
          setBook(foundBook);
          
          // Owner info might be included in the book object from the API
          if (foundBook.ownerId && typeof foundBook.ownerId === 'object') {
            setOwner(foundBook.ownerId);
          } else if (foundBook.owner) {
            // Some APIs might return owner as a separate field
            setOwner(foundBook.owner);
          } else {
            setOwner(null);
          }
          
          setError(null);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id, getBookById]);

  const handleStatusToggle = async () => {
    if (!book) return;
    
    try {
      const newStatus = book.status === 'available' ? 'rented' : 'available';
      await updateBookStatus(id, newStatus);
      setBook({ ...book, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update book status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(id);
      navigate('/books');
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book');
    }
    setShowDeleteConfirm(false);
  };

  const handleRequestBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    setIsRequesting(true);
    try {
      await createTransaction({
        bookId: id,
        message: requestMessage
      });
      setShowRequestModal(false);
      toast.success('Request sent successfully!');
    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.message || 'Failed to send request');
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="glass-card p-8 max-w-lg mx-auto">
          <div className="animate-spin w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading Book Details</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="glass-card p-8 max-w-lg mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "The book you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/books" className="btn btn-primary">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const isUserBook = currentUser && isOwner && 
    (book.ownerId === currentUser.id || 
     (book.ownerId && book.ownerId._id === currentUser.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="mb-6">
        <Link to="/books" className="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Books
        </Link>
      </div>
      
      <div className="glass-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-[400px] md:h-auto">
            <img 
              src={getImageUrl(book.cover)}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>
              </div>
              
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                book.status === 'available' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
              }`}>
                {book.status === 'available' ? 'Available' : 'Rented/Exchanged'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Genre
                </h3>
                <p className="mt-1">
                  {book.genre || 'Not specified'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Location
                </h3>
                <p className="mt-1">
                  {book.location}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {book.description || 'No description available for this book.'}
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-4">
                Contact Information
              </h3>
              
              {owner ? (
                <div className="bg-gray-50 dark:bg-dark-300 rounded-lg p-4">
                  {/* Updated owner information with profile link and trust score */}
                  {owner._id && (
                    <div className="flex items-center justify-between mb-4">
                      <Link to={`/profile/${owner._id}`} className="flex items-center group">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-3">
                          {owner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary-500 transition-colors">{owner.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Book Owner</p>
                        </div>
                      </Link>
                      
                      {owner.trustScore && (
                        <div className="flex items-center">
                          <TrustScoreBadge score={owner.trustScore.trustScore} size="md" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* If no owner ID available, fallback to the previous display */}
                  {!owner._id && (
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{owner.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Book Owner</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      <span>{owner.mobile}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <span>{owner.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Owner information is not available.
                </p>
              )}
            </div>
            
            {isUserBook && (
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleStatusToggle}
                  className={`btn flex-1 ${
                    book.status === 'available' 
                      ? 'btn-amber' 
                      : 'btn-secondary'
                  }`}
                >
                  Mark as {book.status === 'available' ? 'Rented/Exchanged' : 'Available'}
                </button>
                
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn flex-shrink-0 bg-red-500 hover:bg-red-600 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            )}

            {/* Request Button */}
            {book.status === 'available' && !isUserBook && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn btn-primary mt-4"
              >
                Request Book
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Request Book</h3>
            <form onSubmit={handleRequestBook}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Message to Owner (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
                  rows="4"
                  placeholder="Write a message to the book owner..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-outline"
                  disabled={isRequesting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequesting}
                  className="btn btn-primary"
                >
                  {isRequesting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Confirmation</h3>
            <p className="mb-6">Are you sure you want to delete "{book?.title}"?</p>
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
    </div>
  );
};

export default BookDetailPage;