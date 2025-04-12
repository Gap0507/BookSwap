import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';

const DashboardPage = () => {
  const { currentUser, isOwner, isAuthenticated } = useAuth();
  const { books, addBook, getBooksByOwner } = useBooks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const fetchUserBooks = async () => {
      if (isOwner && currentUser) {
        setLoading(true);
        try {
          const books = await getBooksByOwner(currentUser.id);
          setUserBooks(books || []);
        } catch (err) {
          console.error('Error fetching user books:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserBooks();
  }, [isOwner, currentUser, getBooksByOwner]);

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
          
          {isOwner && (
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
                <BookCard key={book.id} book={book} />
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
                <BookCard key={book.id} book={book} />
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
    </div>
  );
};

export default DashboardPage;
