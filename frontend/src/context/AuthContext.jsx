import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

// Flag to determine if we're using the backend API or local storage
const USE_BACKEND_API = true;

// Export the context provider component first
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      if (USE_BACKEND_API && token) {
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
      } else if (!USE_BACKEND_API) {
        // Fall back to local storage if not using backend
        const user = getFromLocalStorage('currentUser');
        if (user) {
          setCurrentUser(user);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    if (USE_BACKEND_API) {
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
    } else {
      // Fall back to local storage implementation
      const users = getFromLocalStorage('users', []);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        saveToLocalStorage('currentUser', user);
        return { success: true, user };
      }
      
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = async (userData) => {
    if (USE_BACKEND_API) {
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
    } else {
      // Fall back to local storage implementation
      const users = getFromLocalStorage('users', []);
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already in use' };
      }
      
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };
      
      const updatedUsers = [...users, newUser];
      saveToLocalStorage('users', updatedUsers);
      
      // Log in the new user
      setCurrentUser(newUser);
      saveToLocalStorage('currentUser', newUser);
      
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    if (USE_BACKEND_API) {
      localStorage.removeItem('token');
      setToken(null);
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
