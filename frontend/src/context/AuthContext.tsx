'use client'; // This ensures the code runs only on the client side
 
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
 
interface AuthContextProps {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
}
 
export const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: () => { },
    logout: () => { },
});
 
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Track if loading is happening
    const router = useRouter();
 
    // Function to initialize user from localStorage
    const initializeUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // If user data exists, set it in state
        } else {
            setUser(null); // Otherwise, set user to null
            router.push('/pages/login'); // Redirect to login if no user found
        }
    };
 
    useEffect(() => {
        initializeUser(); // Initialize user check on mount
        setIsLoading(false); // After the check, stop loading
    }, []); // Empty dependency array ensures this runs once on mount
 
        const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
    };
 
    // Function to logout and clear session data
    const logout = () => {
        setUser(null); // Clear user data from state
        localStorage.removeItem('user'); // Remove user data from localStorage
        router.push('/pages/login'); // Redirect to login page
    };
 
    // Prevent rendering until user data is initialized
    if (isLoading) {
        return null; // Prevent rendering until the loading is complete
    }
 
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
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