// Default to localhost if env variable is not set
const API_URL = `${import.meta.env.VITE_API_URL}`;

// Helper for making API requests
export const apiRequest = async (endpoint, options = {}) => {
  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Build request options
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

// Helper for file uploads
export const apiFileUpload = async (endpoint, formData, method = 'POST') => {
  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  
  // For file uploads, don't set Content-Type as it will be set by the browser with boundary
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: formData
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

// Auth API endpoints
export const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(userData) 
    }),
  
  login: (credentials) => 
    apiRequest('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
  
  getProfile: () => 
    apiRequest('/auth/profile'),
    
  getUserById: (userId) =>
    apiRequest(`/auth/users/${userId}`),
    
  updateProfile: (userData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
    
  rateUser: (userId, ratingData) =>
    apiRequest(`/auth/users/${userId}/rate`, {
      method: 'POST',
      body: JSON.stringify(ratingData)
    }),

    checkRating: (userId, transactionId) =>
      apiRequest(`/auth/users/${userId}/ratings/check`, {
        method: 'POST',
        body: JSON.stringify({ transactionId })
      })
};

// Books API endpoints
export const booksAPI = {
  getAllBooks: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add search params if provided
    if (params.title) queryParams.append('title', params.title);
    if (params.author) queryParams.append('author', params.author);
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.location) queryParams.append('location', params.location);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/books${queryString}`);
  },
  
  getBookById: (id) => 
    apiRequest(`/books/${id}`),
  
  createBook: (bookData) => {
    // If there's a file to upload, use FormData
    if (bookData.coverFile) {
      const formData = new FormData();
      
      // Add book data fields to formData
      for (const key in bookData) {
        if (key !== 'coverFile' && key !== 'cover') {
          formData.append(key, bookData[key]);
        }
      }
      
      // Add the file
      if (bookData.coverFile) {
        formData.append('cover', bookData.coverFile);
      }
      
      return apiFileUpload('/books', formData);
    }
    
    // If no file, use standard JSON request
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },
  
  updateBook: (id, bookData) => {
    // If there's a file to upload, use FormData
    if (bookData.coverFile) {
      const formData = new FormData();
      
      // Add book data fields to formData
      for (const key in bookData) {
        if (key !== 'coverFile' && key !== 'cover') {
          formData.append(key, bookData[key]);
        }
      }
      
      // Add the file
      if (bookData.coverFile) {
        formData.append('cover', bookData.coverFile);
      }
      
      return apiFileUpload(`/books/${id}`, formData, 'PUT');
    }
    
    // If no file, use standard JSON request
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  },
  
  deleteBook: (id) => 
    apiRequest(`/books/${id}`, {
      method: 'DELETE'
    }),
  
  updateBookStatus: (id, status) => 
    apiRequest(`/books/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  
  getBooksByOwner: (userId) => 
    apiRequest(`/books/owner/${userId}`)
};

// Transactions API endpoints
export const transactionsAPI = {
  createTransaction: (data) => 
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getMyTransactions: () => 
    apiRequest('/transactions'),
  
  getTransactionById: (id) => 
    apiRequest(`/transactions/${id}`),
  
  updateTransactionStatus: (id, status) => 
    apiRequest(`/transactions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
};