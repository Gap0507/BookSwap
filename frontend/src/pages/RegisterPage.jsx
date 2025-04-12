import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.mobile || !formData.role) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: formData.role
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full glass-card p-8 animate-scaleIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join the book exchange community
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="mobile" className="label">
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              className="input"
              placeholder="123-456-7890"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="label">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.role === 'owner' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300'
                } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !loading && setFormData(prev => ({ ...prev, role: 'owner' }))}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mr-2 ${formData.role === 'owner' ? 'text-primary-600' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="font-medium">Book Owner</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  I want to share or rent my books
                </p>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.role === 'seeker' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300'
                } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !loading && setFormData(prev => ({ ...prev, role: 'seeker' }))}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mr-2 ${formData.role === 'seeker' ? 'text-primary-600' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <span className="font-medium">Book Seeker</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  I'm looking for books to read
                </p>
              </div>
            </div>
            <input
              type="hidden"
              name="role"
              value={formData.role}
            />
          </div>
          
          <div className="pt-4">
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
