
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { ThemeProvider } from './context/ThemeContext';
import { initializeLocalStorage } from './utils/localStorage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';

function App() {
  useEffect(() => {
    // Initialize local storage with sample data
    initializeLocalStorage();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BookProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
