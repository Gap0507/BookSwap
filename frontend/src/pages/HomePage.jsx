import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

function GridPattern() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full select-none overflow-hidden [mask-image:radial-gradient(white,transparent_85%)]">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/70 via-secondary-50/70 to-amber-50/70 dark:from-primary-950/20 dark:via-secondary-950/20 dark:to-amber-950/20" />
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute -left-[40%] -top-[40%] h-[800px] w-[800px] rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/10 animate-blob" />
      <div className="absolute -right-[40%] top-[20%] h-[600px] w-[600px] rounded-full bg-secondary-400/20 blur-3xl dark:bg-secondary-600/10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[10%] left-[20%] h-[700px] w-[700px] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-600/10 animate-blob animation-delay-4000" />
    </div>
  );
}

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <GridPattern />

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="relative flex items-center bg-gray-900 dark:bg-white/10 px-6 py-2 rounded-full">
              <span className="text-sm font-medium text-white">
                Join the Reading Revolution
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight">
            <span className="block text-white mb-2">Share Stories,</span>
            <span className="block text-white">
              Connect Through
              <span className="text-primary-400"> Books</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our vibrant community where every book tells a story
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/books" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative flex items-center">
                Explore Library
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <GridPattern />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Circles */}
          <div className="absolute top-1/4 left-4 w-72 h-72 bg-primary-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-1/4 right-4 w-72 h-72 bg-secondary-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="relative inline-flex items-center p-1 mb-8 group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient" />
              <div className="relative flex items-center space-x-2 bg-white dark:bg-gray-900 px-6 py-3 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500" />
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Join the Reading Revolution
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8">
                <span className="block mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Share Stories,
                </span>
                <span className="relative inline-block">
                  Connect Through
                  <span className="relative">
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <span className="relative text-primary-600 dark:text-primary-400"> Books</span>
                  </span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed relative">
              <span className="relative">
                Join our vibrant community where every book tells a story
                
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/books" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center">
                  Explore Library
                  <svg className="w-5 h-5 ml-2 -mr-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white rounded-full overflow-hidden transform transition-all duration-500 hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gray-900 dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <span className="relative flex items-center">
                    Join Community
                    <span className="ml-2 text-2xl group-hover:rotate-90 transition-transform duration-300">→</span>
                  </span>
                </Link>
              )}
            </div>

            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="glass-card p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">Books</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ready to Share</div>
              </div>
              <div className="glass-card p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">Community</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growing Daily</div>
              </div>
              <div className="glass-card p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">Cities</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Connected</div>
              </div>
              <div className="glass-card p-4 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Exchanges</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Made Easy</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">
            How <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">BookSwap</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="glass-card p-8 transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8 overflow-hidden rounded-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"
                  alt="Create Account"
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm font-medium">Step 1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join as a Book Owner to share your collection or as a Seeker to discover new reads.
              </p>
            </div>
            
            <div className="glass-card p-8 transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8 overflow-hidden rounded-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="List Books"
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm font-medium">Step 2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Share Your Library</h3>
              <p className="text-gray-600 dark:text-gray-300">
                List your books with beautiful covers and detailed descriptions to attract potential readers.
              </p>
            </div>
            
            <div className="glass-card p-8 transform hover:scale-105 transition-all duration-500">
              <div className="relative mb-8 overflow-hidden rounded-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1049&q=80"
                  alt="Connect"
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm font-medium">Step 3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect & Exchange</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Meet fellow book lovers, arrange exchanges, and grow your reading network locally.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full">
          {/* Background with contained overflow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/70 via-secondary-50/70 to-amber-50/70 dark:from-primary-950/20 dark:via-secondary-950/20 dark:to-amber-950/20" />
          <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
          {/* Adjusted blob positions to prevent overflow */}
          <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/10 animate-blob" />
          <div className="absolute right-0 top-[20%] h-[500px] w-[500px] rounded-full bg-secondary-400/20 blur-3xl dark:bg-secondary-600/10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-[20%] h-[550px] w-[550px] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-600/10 animate-blob animation-delay-4000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Join our community of book lovers and start sharing your favorite reads today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/books" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-700 bg-white rounded-full overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
            >
              <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center">
                Browse Collection
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full overflow-hidden transform transition-all duration-500 hover:scale-105"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
                <span className="relative flex items-center">
                  Create Account
                  <span className="ml-2 text-2xl group-hover:rotate-90 transition-transform duration-300">→</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
