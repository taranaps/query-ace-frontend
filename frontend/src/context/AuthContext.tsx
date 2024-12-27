'use client'; // This ensures the code runs only on the client side

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false); // to track mounting state
    const router = useRouter();

    // Run only on the client-side (after mount)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use `useEffect` to check for token in localStorage
    useEffect(() => {
        if (isMounted) {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
            }
        }
    }, [isMounted]);

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        router.push('/login'); // router usage after mounting
    };

    // Don't render anything until mounted
    if (!isMounted) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
