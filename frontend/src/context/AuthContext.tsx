/**
 * @module AuthContext
 * @description
 * Handles user authentication state management across the application.
 * Provides login, logout functionality and maintains user session.
 * Features:
 * - Persistent authentication using localStorage
 * - Token management
 * - User role handling
 * - Session management
 * - Protected route access
 */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @interface AuthContextProps
 * @description
 * Defines the shape of authentication context data and methods.
 * 
 * @property {any} user - Current user data
 * @property {string|null} token - Authentication token
 * @property {Function} login - Method to handle user login
 * @property {Function} logout - Method to handle user logout
 */
interface AuthContextProps {
   user: any;
   token: string | null;
   login: (response: any) => void;
   logout: () => void;
}

/**
 * @constant AuthContext
 * @description
 * Creates the authentication context with default values.
 * Used by components to access authentication state.
 */
export const AuthContext = createContext<AuthContextProps>({
   user: null,
   token: null,
   login: () => {},
   logout: () => {}
});

/**
 * @component AuthProvider
 * @description
 * Wraps the application to provide authentication context.
 * Manages:
 * - User session persistence
 * - Token storage and retrieval
 * - Loading states
 * - Navigation after auth changes
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [token, setToken] = useState<string | null>(null);
   const [user, setUser] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();

   /**
    * @function useEffect
    * @description
    * Initializes authentication state from localStorage on component mount.
    * Checks for existing session and restores it if found.
    * Sets up cookie for cross-tab authentication.
    */
   useEffect(() => {
       const storedToken = localStorage.getItem('token');
       const storedUser = localStorage.getItem('user');
       
       if (storedToken && storedUser) {
           setToken(storedToken);
           setUser(JSON.parse(storedUser));
           document.cookie = `token=${storedToken}; path=/`;
       }
       setIsLoading(false);
   }, []);

   /**
    * @function handleUnauthorized
    * @description
    * Handles unauthorized access attempts.
    * - Clears local storage
    * - Resets auth state
    * - Redirects to login
    */
   const handleUnauthorized = () => {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       setToken(null);
       setUser(null);
       router.push('/pages/login');
   };

   /**
    * @function login
    * @description
    * Processes successful login attempts.
    * - Stores authentication data
    * - Updates context state
    * - Sets up cookies
    * - Structures user data
    * 
    * @param {Object} response - Login response from server
    * @param {string} response.token - Authentication token
    * @param {string} response.type - User type
    * @param {string} response.role - User role
    * @param {string} response.userId - User identifier
    */
   const login = async (response: any) => {
       const { token, type, role, userId } = response;
       
       const userData = {
           userId,
           role,
           roles: [{ roleName: role }]  
       };
   
       localStorage.setItem('token', token);
       localStorage.setItem('user', JSON.stringify(userData));
       document.cookie = `token=${token}; path=/`;
       setToken(token);
       setUser(userData);
   };

   /**
    * @function logout
    * @description
    * Handles user logout process.
    * - Calls logout API
    * - Cleans up local storage
    * - Removes cookies
    * - Resets auth state
    * - Redirects to login
    * 
    * Error Handling:
    * - Logs API failures
    * - Ensures cleanup even if API fails
    * - Forces logout on client side
    */
   const logout = async () => {
       try {
           const response = await fetch('/api/auth/logout', {
               method: 'POST',
               headers: {
                   'Authorization': `Bearer ${token}`
               }
           });

           if (!response.ok) {
               console.error('Logout failed');
           }
       } catch (error) {
           console.error('Logout error:', error);
       } finally {
           localStorage.removeItem('token');
           localStorage.removeItem('user');
           document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
           setToken(null);
           setUser(null);
           router.push('/pages/login');
       }
   };

   return (
       <AuthContext.Provider value={{ user, token, login, logout }}>
           {!isLoading && children}
       </AuthContext.Provider>
   );
};

/**
 * @hook useAuth
 * @description
 * Custom hook to access authentication context.
 * Ensures component is within AuthProvider before allowing access.
 * Provides easy access to auth functions and state.
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextProps} Authentication context values and methods
 */
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};