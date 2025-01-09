'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/lib/auth';
import type { AuthError } from '@/app/lib/types/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      const redirectPath = response.role === 'SUPER_ADMIN' 
        ? '/dashboard/super-admin'
        : '/dashboard/admin';
        
      router.push(redirectPath);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    } finally {
      setIsLoading(false);
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
          {error && <div className={styles['error-message']}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles['login-form-group']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className={styles['login-form-group']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className={styles['login-container-forgot-password']}>
              <a>Forgot Password?</a>
            </div>
            <button 
              type="submit" 
              className={styles['login-button']}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <div className={styles['false-container']}></div>
      </div>
    </div>
  );
}