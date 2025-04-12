const API_URL = 'http://localhost:5000/api';

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
    apiRequest('/auth/profile')
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
  
  createBook: (bookData) => 
    apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    }),
  
  updateBook: (id, bookData) => 
    apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    }),
  
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