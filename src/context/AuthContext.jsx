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
      try {
        // Stringify with null replacer and 2 spaces for readability
        const userString = JSON.stringify(currentUser, null, 2);
        
        console.log('Setting auth state with user:', currentUser);
        console.log('Current domain:', window.location.hostname);
        
        // Store in localStorage
        localStorage.setItem('currentUser', userString);
        console.log('Stored in localStorage');
        
        // Store in sessionStorage
        sessionStorage.setItem('currentUser', userString);
        console.log('Stored in sessionStorage');
        
        // Set cookie for root domain to enable sharing between subdomains
        const cookieOptions = 'path=/;max-age=86400;SameSite=Lax;Secure';
        
        // Set cookie without domain first (fallback)
        document.cookie = `auth=${encodeURIComponent(userString)};${cookieOptions}`;
        console.log('Set basic cookie');
        
        // Set cookie for netlify.app domain
        if (window.location.hostname.includes('netlify.app')) {
          document.cookie = `auth=${encodeURIComponent(userString)};domain=.netlify.app;${cookieOptions}`;
          console.log('Set netlify domain cookie');
        }
        
        // Log all cookies for debugging
        console.log('Current cookies:', document.cookie);
      } catch (error) {
        console.error('Error setting auth state:', error);
      }
    } else {
      try {
        console.log('Clearing auth state');
        
        // Clear storage
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Clear cookies with updated options
        const clearCookieOptions = 'path=/;max-age=0;SameSite=Lax;Secure';
        
        // Clear cookie without domain
        document.cookie = `auth=;${clearCookieOptions}`;
        
        // Clear cookie with netlify domain
        if (window.location.hostname.includes('netlify.app')) {
          document.cookie = `auth=;domain=.netlify.app;${clearCookieOptions}`;
        }
        
        console.log('Auth state cleared');
        console.log('Remaining cookies:', document.cookie);
      } catch (error) {
        console.error('Error clearing auth state:', error);
      }
    }
  }, [currentUser]);

  // Check for authentication state on mount and during navigation
  useEffect(() => {
    const checkAuthState = () => {
      console.log('Checking auth state');
      console.log('Current domain:', window.location.hostname);
      console.log('All cookies:', document.cookie);
      
      // Try to get auth state from multiple sources
      const localUser = localStorage.getItem('currentUser');
      const sessionUser = sessionStorage.getItem('currentUser');
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
      
      console.log('Found storage items:', {
        hasLocalStorage: !!localUser,
        hasSessionStorage: !!sessionUser,
        hasCookie: !!authCookie,
        cookieValue: authCookie ? authCookie.trim() : 'none'
      });
      
      let userData = null;
      
      // Try cookie first
      if (authCookie) {
        try {
          const cookieValue = authCookie.split('=')[1];
          console.log('Raw cookie value:', cookieValue);
          userData = JSON.parse(decodeURIComponent(cookieValue));
          console.log('Parsed cookie data:', userData);
        } catch (e) {
          console.error('Failed to parse auth cookie:', e);
        }
      }
      
      // Try sessionStorage if no cookie data
      if (!userData && sessionUser) {
        try {
          userData = JSON.parse(sessionUser);
          console.log('Using session storage data:', userData);
        } catch (e) {
          console.error('Failed to parse session storage:', e);
        }
      }
      
      // Try localStorage as last resort
      if (!userData && localUser) {
        try {
          userData = JSON.parse(localUser);
          console.log('Using local storage data:', userData);
        } catch (e) {
          console.error('Failed to parse local storage:', e);
        }
      }

      if (userData) {
        console.log('Setting current user to:', userData);
        setCurrentUser(userData);
      } else if (currentUser) {
        console.log('Clearing current user');
        setCurrentUser(null);
      }
    };

    // Check immediately and set up listeners
    checkAuthState();
    
    const handleStorageChange = (e) => {
      console.log('Storage changed:', e);
      checkAuthState();
    };
    
    const handleFocus = () => {
      console.log('Window focused');
      checkAuthState();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
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

      // Fetch complete user data to ensure we have all fields
      const completeUserData = await userService.getUserById(user.id);
      if (!completeUserData) {
        throw new Error('Failed to load complete user data');
      }
      
      // Set session identifiers
      const sessionId = Date.now().toString();
      localStorage.setItem('browserSessionId', sessionId);
      localStorage.setItem('sessionEmail', email);
      
      // Update user's active status
      await userService.updateUserActiveStatus(completeUserData.id, true);
      
      // Store complete user data
      setCurrentUser(completeUserData);
      return completeUserData;
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
      
      // Clear all storage mechanisms
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear the shared authentication cookie
      document.cookie = 'auth=;domain=.netlify.app;path=/;max-age=0;secure;samesite=lax';
      
      // Also clear it from the root path
      document.cookie = 'auth=;path=/;max-age=0';
      
      // Reset error state
      setError(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local data even if Firebase update fails
      setCurrentUser(null);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = 'auth=;domain=.netlify.app;path=/;max-age=0;secure;samesite=lax';
      document.cookie = 'auth=;path=/;max-age=0';
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
