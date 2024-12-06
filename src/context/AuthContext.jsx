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
      // Stringify with null replacer and 2 spaces for readability
      const userString = JSON.stringify(currentUser, null, 2);
      localStorage.setItem('currentUser', userString);
      
      // Set both localStorage and sessionStorage for redundancy
      sessionStorage.setItem('currentUser', userString);
      
      // Set authentication cookie that can be shared between domains
      document.cookie = `auth=${encodeURIComponent(userString)};domain=.netlify.app;path=/;max-age=86400;secure;samesite=lax`;
    } else {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      document.cookie = 'auth=;domain=.netlify.app;path=/;max-age=0;secure;samesite=lax';
    }
  }, [currentUser]);

  // Check for authentication state on mount and during navigation
  useEffect(() => {
    const checkAuthState = () => {
      // Try to get auth state from multiple sources
      const localUser = localStorage.getItem('currentUser');
      const sessionUser = sessionStorage.getItem('currentUser');
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
      
      let userData = null;
      
      // Priority: Cookie > SessionStorage > LocalStorage
      if (authCookie) {
        try {
          userData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        } catch (e) {
          console.error('Failed to parse auth cookie:', e);
        }
      } else if (sessionUser) {
        try {
          userData = JSON.parse(sessionUser);
        } catch (e) {
          console.error('Failed to parse session storage:', e);
        }
      } else if (localUser) {
        try {
          userData = JSON.parse(localUser);
        } catch (e) {
          console.error('Failed to parse local storage:', e);
        }
      }

      // Only update if there's a change in auth state
      if (userData && (!currentUser || userData.id !== currentUser.id)) {
        setCurrentUser(userData);
      } else if (!userData && currentUser) {
        setCurrentUser(null);
      }
    };

    // Check immediately
    checkAuthState();

    // Check on focus and storage changes
    window.addEventListener('focus', checkAuthState);
    window.addEventListener('storage', checkAuthState);

    // Periodic check every 30 seconds
    const interval = setInterval(checkAuthState, 30000);

    return () => {
      window.removeEventListener('focus', checkAuthState);
      window.removeEventListener('storage', checkAuthState);
      clearInterval(interval);
    };
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
