import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to "/"
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 animate-scaleIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to access your account
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className={`btn btn-primary w-full py-3 ${loading ? 'opacity-70' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
              Sign up
            </Link>
          </p>
          
          {/* Demo accounts */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@example.com');
                  setPassword('password123');
                }}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-dark-300"
                disabled={loading}
              >
                Book Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('seeker@example.com');
                  setPassword('password123');
                }}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-dark-300"
                disabled={loading}
              >
                Book Seeker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
