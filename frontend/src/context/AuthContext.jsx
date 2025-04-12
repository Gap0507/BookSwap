import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

const AuthContext = createContext();

// Export the context provider component first
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user is already logged in
    const user = getFromLocalStorage('currentUser');
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getFromLocalStorage('users', []);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      saveToLocalStorage('currentUser', user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (userData) => {
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
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
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
