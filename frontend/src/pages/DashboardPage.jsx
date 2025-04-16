import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useTransaction } from '../context/TransactionContext';
import BookCard from '../components/BookCard';
import UserProfile from '../components/UserProfile';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const { currentUser, isOwner, isAuthenticated } = useAuth();
  const { books, addBook, getBooksByOwner } = useBooks();
const { transactions, fetchTransactions, updateTransactionStatus } = useTransaction();  const [showAddForm, setShowAddForm] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    location: '',
    description: '',
    cover: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  // Fetch user's books when component mounts
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isAuthenticated || !isMounted) return;

      setLoading(true);
      try {
        if (isMounted) {
          await fetchTransactions();
          if (isOwner && currentUser) {
            const books = await getBooksByOwner(currentUser.id);
            if (isMounted) {
              setUserBooks(books || []);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isOwner, currentUser?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Generate preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Store the actual file for upload instead of base64 string
      setNewBook(prev => ({ ...prev, coverFile: file }));
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!newBook.title || !newBook.author || !newBook.location) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const addedBook = await addBook({
        ...newBook,
        ownerId: currentUser.id
      });

      // Update user books list with the new book
      setUserBooks(prev => [...prev, addedBook]);

      // Reset form
      setNewBook({
        title: '',
        author: '',
        genre: '',
        location: '',
        description: '',
        cover: ''
      });
      setPreviewUrl('');
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error('Error adding book:', err);
    }
  };

  const handleStatusUpdate = async (transactionId, newStatus) => {
    try {
      await updateTransactionStatus(transactionId, newStatus);
      // Refresh transactions after status update
      await fetchTransactions();
      toast.success(`Request ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update request status');
    }
  };

  // Filter transactions
  const pendingIncomingRequests = transactions.filter(t => 
    (typeof t.ownerId === 'object' ? t.ownerId._id : t.ownerId) === currentUser?.id && 
    t.status === 'requested'
  );

  const myTransactions = transactions.filter(t => {
    const isOwner = (typeof t.ownerId === 'object' ? t.ownerId._id : t.ownerId) === currentUser?.id;
    const isBorrower = (typeof t.borrowerId === 'object' ? t.borrowerId._id : t.borrowerId) === currentUser?.id;
    return isOwner || isBorrower;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="glass-card p-6 mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isOwner ? 'Manage your book listings' : 'Find books to borrow or exchange'}
            </p>
          </div>
          
          {isOwner && activeTab === 'books' && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary flex items-center"
            >
              {showAddForm ? (
                <span>Cancel</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New Book
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {isOwner ? 'My Books' : 'Available Books'}
          </button>
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Book Requests
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            My Profile
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Account Settings
          </button>
        </nav>
      </div>
      
      <div className="animate-fadeIn">
        {/* Books Tab */}
        {activeTab === 'books' && (
          <>
            {isOwner && showAddForm && (
              <div className="glass-card p-6 mb-8 animate-scaleIn">
                <h2 className="text-xl font-serif font-bold mb-4">Add New Book</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label htmlFor="title" className="label">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newBook.title}
                        onChange={handleInputChange}
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
                        value={newBook.author}
                        onChange={handleInputChange}
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
                        value={newBook.genre}
                        onChange={handleInputChange}
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
                        value={newBook.location}
                        onChange={handleInputChange}
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
                        value={newBook.description}
                        onChange={handleInputChange}
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
                          Upload Image
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
                      onClick={() => {
                        setShowAddForm(false);
                        setError('');
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-8">
                      Add Book
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {isOwner ? (
              <>
                <h2 className="text-2xl font-serif font-bold mb-6">Your Books</h2>
                
                {loading ? (
                  <div className="glass-card p-12 text-center">
                    <div className="animate-spin w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p>Loading your books...</p>
                  </div>
                ) : userBooks.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No books listed yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Start by adding your first book to share with the community.
                    </p>
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="btn btn-primary inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Your First Book
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBooks.map((book) => (
                      <BookCard key={book._id || book.id} book={book} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Available Books</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.filter(book => book.status === 'available').slice(0, 3).map((book) => (
                      <BookCard key={book._id || book.id} book={book} />
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Ready to find more books?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                    Browse our complete collection to find your next great read.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/books'}
                    className="btn btn-primary px-8"
                  >
                    Browse All Books
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Book Requests</h2>
            
            {/* Pending Approval Requests - Only shown to owners */}
            {isOwner && pendingIncomingRequests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Pending Approval</h3>
                <div className="space-y-4">
                  {pendingIncomingRequests.map((transaction) => (
                    <div key={transaction._id} className="glass-card p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{transaction.bookId.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Requested by: {transaction.borrowerId.name}
                          </p>
                          {transaction.message && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              Message: {transaction.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(transaction._id, 'approved')}
                            className="btn btn-sm btn-primary"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(transaction._id, 'rejected')}
                            className="btn btn-sm btn-danger"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Transactions */}
            <div>
              <h3 className="text-xl font-medium mb-4">All Requests</h3>
              {myTransactions.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">No book requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTransactions.map((transaction) => {
                    const isRequester = transaction.borrowerId._id === currentUser?.id;
                    return (
                      <div key={transaction._id} className="glass-card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{transaction.bookId.title}</h4>
                              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'approved' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : transaction.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </div>
                            
                            {isRequester ? (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Owner: {transaction.ownerId.name}
                                </p>
                                {transaction.status === 'approved' && (
                                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                    Book Owner will contact you soon via email or phone number
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Requested by: {transaction.borrowerId.name}
                                </p>
                                {transaction.status === 'approved' && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm font-medium">Contact Information:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      Email: {transaction.borrowerId.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      Phone: {transaction.borrowerId.mobile}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {transaction.message && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Message: {transaction.message}
                              </p>
                            )}
                          </div>
                          
                          {transaction.status === 'requested' && isRequester && (
                            <button
                              onClick={() => handleStatusUpdate(transaction._id, 'cancelled')}
                              className="btn btn-sm btn-outline"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <UserProfile />
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Update your profile information below.
            </p>
            
            <AccountSettingsForm />
          </div>
        )}
      </div>
    </div>
  );
};

// Account Settings Form Component
const AccountSettingsForm = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        mobile: currentUser.mobile || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create form data for API submission
      const userData = { ...formData };
      
      const result = await updateProfile(userData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An unexpected error occurred.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* User Avatar (Initial only) */}
        <div className="flex-shrink-0 flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-4xl font-bold">
            {currentUser?.name?.charAt(0) || '?'}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            {currentUser?.role === 'owner' ? 'Book Owner' : 'Book Seeker'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="mobile" className="label">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            // Reset form to current user data
            if (currentUser) {
              setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                mobile: currentUser.mobile || ''
              });
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary px-8"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default DashboardPage;