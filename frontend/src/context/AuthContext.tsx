"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * AuthContext provides a way to manage authentication state and actions for the application.
 * It contains the current user, and functions for login and logout.
 *
 * @interface 
 * @type {Object} AuthContextProps
 * @property {any} user - The current authenticated user, or `null` if not authenticated.
 * @property {function(any): void} login - Function to log the user in by setting the user state and localStorage.
 * @property {function(): void} logout - Function to log the user out, clearing state and localStorage, and redirecting to the login page.
 */

interface AuthContextProps {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
}

/**
 * Creates the AuthContext with default values.
 * @function AuthContext
 * @type {React.Context<AuthContextProps>}
 */

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => { },
  logout: () => { },
});

/**
 * AuthProvider wraps the application and provides authentication-related functionality.
 * It initializes the user from localStorage and manages login/logout actions.
 *
 * @function AuthProvider
 * @param {{ children: ReactNode }} props - The children components wrapped by the provider.
 * @returns {JSX.Element | null} The AuthContext.Provider component with the authentication state.
 */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

   /**
     * Initializes the user from localStorage and redirects to the login page if no user is found.
     * @function
     * @private
     */

  const initializeUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      router.push("/pages/login");
    }
  };

  useEffect(() => {
    initializeUser();
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   
    /**
     * Logs the user in by saving their data in state and localStorage.
     * @function
     * @param {any} userData - The data of the user to log in.
     */

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

     /**
     * Logs the user out by clearing their data from state and localStorage, and redirecting to the login page.
     * @function
     */

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/pages/login");
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 * Ensures the hook is used within an AuthProvider.
 *
 * @returns {AuthContextProps} The context object containing user, login, and logout.
 * @throws {Error} If used outside of an AuthProvider.
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

