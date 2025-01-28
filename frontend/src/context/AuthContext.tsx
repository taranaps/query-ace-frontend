'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/apiConfig';

interface User {
  id: number;
  role: "SUPER_ADMIN" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE";
  username?: string;
  email?: string;
  userId?:number;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (response: LoginResponse) => void;
  logout: () => Promise<void>;
}

interface LoginResponse {
  token: string;
  role: "SUPER_ADMIN" | "ADMIN";
  userId: number;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initial auth check
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          handleUnauthorized();
          return;
        }
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/pages/login');
  };

  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 401) {
        handleUnauthorized();
      }
      return response;
    };
  
    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  // Token expiration check
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token && isTokenExpired(token)) {
        handleUnauthorized();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const login = (response: LoginResponse) => {
    const userData = {
      id: response.userId,
      role: response.role,
      status: "ACTIVE" as const,
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(response.token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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