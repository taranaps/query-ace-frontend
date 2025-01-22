'use client';

/**
 * @file LoginPage.tsx
 * @description A functional component for handling user login. It includes a form for email and password, 
 * validates user credentials via an API, and redirects to the dashboard upon successful login.
 */


import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

/**
 * LoginPage component renders the login form and handles user authentication.
 *
 * @component
 * @returns {JSX.Element} The rendered login page.
 */


const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const router = useRouter();

    /**
    * Handles input changes and updates the form data.
    *
    * @param {React.ChangeEvent<HTMLInputElement>} e - The event triggered on input change.
    */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    /**
     * Handles form submission, sends login credentials to the server, and processes the response.
     *
     * @async
     * @param {React.FormEvent} e - The event triggered on form submission.
     * @returns {Promise<void>} Resolves after handling the login process.
     */
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login(data);
                alert('Logged in Successfully!');
                router.push('/pages/dashboard');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className={styles['login-page']}>
            <div className={styles['login-background']}>
                <img src="/assets/logos/experion-logo.png" alt="Experion Logo" />
            </div>
            <div className={styles['login-foreground']}>
                <div className={styles['login-container']}>
                    <div className={styles['login-container-avatar']}>
                        <img src="/assets/icons/login-avatar.png" alt="Login Avatar" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['login-form-group']}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className={styles['login-form-group']}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className={styles['login-container-forgot-password']}>
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button type="submit" className={styles['login-button']}>
                            Login
                        </button>
                    </form>
                </div>
                <div className={styles['false-container']}></div>
            </div>
        </div>
    );
};

export default LoginPage;