import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

// Export the context provider component first
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // Try to fetch user profile from backend using the token
        try {
          const data = await authAPI.getProfile();
          if (data.success) {
            setCurrentUser(data.user);
          } else {
            // If token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      
      if (data.success) {
        setCurrentUser(data.user);
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      if (data.success) {
        setCurrentUser(data.user);
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    setToken(null);
  };

  const refreshTrustScore = async () => {
    if (!currentUser || !token) return null;
    
    try {
      const data = await authAPI.getProfile();
      if (data.success) {
        setCurrentUser(data.user);
        return data.user.trustScore;
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh trust score:', error);
      return null;
    }
  };

  const updateProfile = async (userData) => {
    if (!currentUser || !token) return { success: false, message: 'Not authenticated' };
    
    try {
      const data = await authAPI.updateProfile(userData);
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Update failed' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    isOwner: currentUser?.role === 'owner',
    isSeeker: currentUser?.role === 'seeker',
    trustScore: currentUser?.trustScore || 0,
    refreshTrustScore,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export the hook after the component
export const useAuth = () => {
  return useContext(AuthContext);
};