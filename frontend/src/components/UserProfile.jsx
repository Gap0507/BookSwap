import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, booksAPI, transactionsAPI } from '../utils/api';
import TrustScoreBadge from './TrustScoreBadge';
import BookCard from './BookCard';
import TransactionCard from './TransactionCard';
import { toast } from 'react-hot-toast';

const UserProfile = ({ userId = null }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Determine if viewing own profile or another user's
  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileId = userId || currentUser?.id;
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const userData = isOwnProfile 
          ? await authAPI.getProfile()
          : await authAPI.getUserById(profileId);
        
        setUser(userData.user);
        
        // Fetch user's books
        const booksData = await booksAPI.getBooksByOwner(profileId);
        setUserBooks(booksData.books);
        
        // Fetch transactions if viewing own profile
        if (isOwnProfile) {
          await fetchTransactions();
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user profile');
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (profileId) {
      fetchUserData();
    }
  }, [profileId, isOwnProfile]);
  
  // Add a dedicated function to fetch transactions
  const fetchTransactions = async () => {
    try {
      const transactionsData = await transactionsAPI.getMyTransactions();
      setTransactions(transactionsData.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 text-primary-600 dark:text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Error Loading Profile</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error || 'User profile not found'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {user.role === 'owner' ? 'Book Owner' : 'Book Seeker'}
              </span>
            </p>
            {isOwnProfile && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {user.email} • {user.mobile}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center">
            <TrustScoreBadge 
              score={user.trustScore.trustScore} 
              size="lg" 
              detailed={true}
              components={user.trustScore.components}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Trust Score</p>
          </div>
        </div>
        
        {/* Trust Score Progress Bar - show for any user profile */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Trust Score Progress</h3>
            <span className="text-sm font-bold">{user.trustScore.trustScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full" 
              style={{ width: `${user.trustScore.trustScore}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Average Rating</h4>
                <span className="text-sm font-bold">{user.trustScore.averageRating.toFixed(1)}/5</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(user.trustScore.averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (50% weight)
                </span>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Completed Transactions</h4>
                <span className="text-sm font-bold">{user.trustScore.completedTransactions}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (30% weight)
                </span>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Cancellations</h4>
                <span className="text-sm font-bold">{user.trustScore.cancelledTransactions}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (20% negative weight)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </button>
          
          <button
            onClick={() => setActiveTab('books')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Books ({userBooks.length})
          </button>
          
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Transactions ({transactions.length})
            </button>
          )}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {user.role === 'owner' 
                  ? 'Book owner sharing their collection with the community.' 
                  : 'Book seeker looking to discover new reads.'}
              </p>
              
              {/* Ratings Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">User Ratings & Reviews ({user.ratings?.length || 0})</h3>
                
                {(!user.ratings || user.ratings.length === 0) ? (
                  <div className="text-gray-500 italic text-center py-4">
                    No ratings yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.ratings.map((rating, index) => (
                      <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {rating.fromUser?.name || 'Anonymous User'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star}
                              className={`w-5 h-5 ${star <= rating.score ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        {rating.comment && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {isOwnProfile ? (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">How to Improve Your Trust Score</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete more transactions successfully</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Maintain high ratings from other users</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Avoid cancelling or rejecting requests</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Trust Score Analysis</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This user has a trust score of {user.trustScore.trustScore}/100, based on their transaction history and ratings.
                </p>
                <div className="flex items-center mt-2">
                  <div className="mr-3">
                    <span className="text-sm font-medium">Reliability Rating:</span>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(user.trustScore.averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'books' && (
          <div>
            {userBooks.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No Books Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {isOwnProfile 
                    ? 'You haven\'t added any books to your collection yet.' 
                    : 'This user hasn\'t added any books to their collection yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'transactions' && isOwnProfile && (
          <div>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No Transactions Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You haven't made any book exchange requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction._id} 
                    transaction={transaction} 
                    onUpdate={fetchTransactions}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;