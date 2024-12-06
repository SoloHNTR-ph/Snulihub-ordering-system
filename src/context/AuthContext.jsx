import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Try to get stored user data on initial load
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      // Set authentication cookie that can be shared between domains
      document.cookie = `auth=${JSON.stringify(currentUser)};domain=.netlify.app;path=/;max-age=86400;secure;samesite=lax`;
    } else {
      localStorage.removeItem('currentUser');
      // Remove the authentication cookie
      document.cookie = 'auth=;domain=.netlify.app;path=/;max-age=0;secure;samesite=lax';
    }
  }, [currentUser]);

  // Check for authentication cookie on mount and during navigation
  useEffect(() => {
    const checkAuthCookie = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
      if (authCookie) {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        if (!currentUser || currentUser.email !== authData.email) {
          setCurrentUser(authData);
        }
      } else if (currentUser) {
        setCurrentUser(null);
      }
    };

    checkAuthCookie();
    window.addEventListener('focus', checkAuthCookie);
    return () => window.removeEventListener('focus', checkAuthCookie);
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Check if there's already a logged-in user in another tab
      const browserSessionId = localStorage.getItem('browserSessionId');
      const storedSessionEmail = localStorage.getItem('sessionEmail');
      
      if (browserSessionId && storedSessionEmail && storedSessionEmail !== email) {
        throw new Error('Another account is already logged in. Please log out first.');
      }

      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Set session identifiers
      const sessionId = Date.now().toString();
      localStorage.setItem('browserSessionId', sessionId);
      localStorage.setItem('sessionEmail', email);
      
      // Update user's active status
      await userService.updateUserActiveStatus(user.id, true);
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        // Update user's active status in Firebase
        await userService.updateUserActiveStatus(currentUser.id, false);
      }
      
      // Clear all session data
      setCurrentUser(null);
      
      // Clear all authentication-related items from localStorage
      localStorage.clear(); // This ensures ALL session data is removed
      
      // Reset error state
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local data even if Firebase update fails
      setCurrentUser(null);
      localStorage.clear();
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isCustomer: currentUser?.category === 'customer',
    isFranchise: currentUser?.category === 'franchise'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
