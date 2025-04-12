
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 dark:from-primary-900/30 dark:to-secondary-900/30 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-slideUp">
              Share Books,<br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                Connect Communities
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0 animate-slideUp animate-delay-100">
              Join our peer-to-peer book exchange platform and discover new stories while sharing your favorites with others.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slideUp animate-delay-200">
              <Link to="/books" className="btn btn-primary px-8 py-3 text-lg">
                Browse Books
              </Link>
              
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline px-8 py-3 text-lg">
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-64 md:h-full -z-10 opacity-10 md:opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M38.5,-65.1C52.9,-60.5,69.3,-54.8,76.3,-43.2C83.3,-31.5,80.9,-14.1,76.1,1.2C71.3,16.5,64,29.8,56.1,43.9C48.2,58,39.7,72.9,26.9,78.5C14.1,84.2,-3,80.5,-20.4,76.6C-37.9,72.7,-55.7,68.6,-67.3,57.9C-78.9,47.2,-84.3,29.9,-85.2,12.8C-86.1,-4.3,-82.3,-21.3,-74.2,-35C-66.1,-48.7,-53.5,-59.2,-40,-64.5C-26.4,-69.7,-11.9,-69.7,1.1,-71.6C14.1,-73.4,24.1,-69.8,38.5,-65.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            How It <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 animate-scaleIn">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up as a Book Owner or Book Seeker to start your journey.
              </p>
            </div>
            
            <div className="glass-card p-6 animate-scaleIn animate-delay-100">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-secondary-600 dark:text-secondary-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">List or Browse Books</h3>
              <p className="text-gray-600 dark:text-gray-300">
                List your books for exchange or browse books available in your area.
              </p>
            </div>
            
            <div className="glass-card p-6 animate-scaleIn animate-delay-200">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-amber-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect & Exchange</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with other book lovers and arrange exchanges on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to start sharing books?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of book lovers today and discover new stories while sharing your favorites with others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/books" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg">
              Browse Books
            </Link>
            
            {!isAuthenticated && (
              <Link to="/register" className="btn border-2 border-white bg-transparent hover:bg-white/10 px-8 py-3 text-lg">
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
