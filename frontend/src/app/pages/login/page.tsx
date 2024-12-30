'use client';

import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

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
                login(data.data); 
                alert('Logged in Successfully!');
                router.push('/dashboard'); 
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
