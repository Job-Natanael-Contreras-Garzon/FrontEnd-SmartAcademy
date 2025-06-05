import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, getStoredUserData, getCurrentUser as apiGetCurrentUser } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const attemptLoadUser = async () => {
      setLoading(true);
      const storedUser = getStoredUserData();
      if (storedUser && storedUser.access_token) {
        // console.log('AuthContext: Found stored user, attempting to validate/refresh:', storedUser);
        try {
          const freshUser = await apiGetCurrentUser(); // This now calls /api/v1/auth/me
          if (freshUser) {
            let effectiveRole = freshUser.role; // This is the role object from /auth/me

            // If the user is a superuser, AND
            // /auth/me returns a problematic role name (e.g., 'unknown'), AND
            // the storedUser (from login) had a valid role string (e.g., "ADMINISTRATOR")
            if (
              freshUser.is_superuser &&
              freshUser.role && freshUser.role.name && 
              freshUser.role.name.toLowerCase() === 'unknown' && // Check for 'unknown'
              storedUser.role && typeof storedUser.role === 'string' && 
              storedUser.role.toUpperCase() === 'ADMINISTRATOR' // Ensure it matches the expected admin role string
            ) {
              console.warn(`AuthContext: /auth/me returned role '${freshUser.role.name}' for a superuser. Using role '${storedUser.role}' from login data to construct a more accurate role object.`);
              // Construct a role object using the string from login
              effectiveRole = {
                name: storedUser.role, // e.g., "ADMINISTRATOR"
                description: `Administrator role (derived from login; /auth/me returned '${freshUser.role.name}')`,
                permissions: freshUser.role.permissions || {}, // Keep permissions from /auth/me if any
                id: freshUser.role.id !== undefined ? freshUser.role.id : 0 // Keep id from /auth/me or use a placeholder
              };
            }

            setCurrentUser({
              ...storedUser,      // Base: includes access_token and original role string from login
              ...freshUser,       // Overwrite with fresh data from /auth/me (email, name, is_superuser etc.)
              role: effectiveRole, // Use the determined (potentially corrected) effectiveRole object
              access_token: storedUser.access_token 
            });
            // console.log('AuthContext: User data refreshed/validated with effectiveRole:', { ...storedUser, ...freshUser, role: effectiveRole, access_token: storedUser.access_token });
          } else {
            // Token might be invalid or /auth/me didn't return a user
            console.warn('AuthContext: /auth/me did not return user data or token is invalid.');
            apiLogout(); // Clear invalid token/data
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('AuthContext: Error validating token or fetching user from /auth/me:', error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Authentication/Authorization error, token is likely invalid or insufficient permissions
            console.warn('AuthContext: Authentication/Authorization error. Logging out.');
            apiLogout(); 
            setCurrentUser(null);
          } else if (error.response && error.response.status >= 500) {
            // Server-side error, but we have a stored user. Let's use that.
            console.warn('AuthContext: Server error fetching fresh user data. Using stored user data as fallback.');
            setCurrentUser(storedUser); // Fallback to stored user
          } else {
            // Other client-side errors or unexpected issues, potentially logout
            console.warn('AuthContext: Unhandled error type or network issue. Logging out as a precaution.');
            apiLogout();
            setCurrentUser(null);
          }
        }
      } else {
        // console.log('AuthContext: No stored user found.');
        setCurrentUser(null);
      }
      setLoading(false);
    };
    attemptLoadUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const userData = await apiLogin(credentials);
      if (userData && userData.access_token) {
        // userData from login already contains role and is_superuser
        setCurrentUser(userData);
        setLoading(false);
        return userData;
      } else {
        // Handle login failure (e.g., bad credentials)
        setCurrentUser(null);
        setLoading(false);
        throw new Error(userData.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      setCurrentUser(null);
      setLoading(false);
      throw error; // Re-throw to be caught by UI
    }
  };

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    // Optionally, redirect or clear other app state
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
