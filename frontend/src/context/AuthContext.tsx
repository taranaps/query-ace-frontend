'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Add token utility
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

interface AuthContextProps {
   user: any;
   token: string | null;
   login: (response: any) => void;
   logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
   user: null,
   token: null,
   login: () => {},
   logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [token, setToken] = useState<string | null>(null);
   const [user, setUser] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
       const storedToken = localStorage.getItem('token');
       const storedUser = localStorage.getItem('user');
       
       if (storedToken && storedUser) {
           if (isTokenExpired(storedToken)) {
               handleUnauthorized();
           } else {
               setToken(storedToken);
               setUser(JSON.parse(storedUser));
               document.cookie = `token=${storedToken}; path=/`;
           }
       }
       setIsLoading(false);
   }, []);

   // Add response interceptor for 401s
   useEffect(() => {
     const originalFetch = window.fetch;
     window.fetch = async (...args) => {
       const response = await originalFetch(...args);
       if (response.status === 401) {
         handleUnauthorized();
       }
       return response;
     };
   }, []);

   // Check token expiry periodically
   useEffect(() => {
     const checkTokenExpiry = () => {
       const storedToken = localStorage.getItem('token');
       if (storedToken && isTokenExpired(storedToken)) {
         handleUnauthorized();
       }
     };

     const interval = setInterval(checkTokenExpiry, 60000);
     return () => clearInterval(interval);
   }, []);

   const handleUnauthorized = () => {
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       setToken(null);
       setUser(null);
       router.push('/pages/login');
   };

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

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};