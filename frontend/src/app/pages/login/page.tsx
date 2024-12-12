"use client";
import React, { useState } from "react";
import loginUser from "@/app/api/login"; // Import the login API function
import styles from './login.module.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>(""); // For displaying error messages
    const [isLoading, setIsLoading] = useState<boolean>(false); // For loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(""); // Reset any previous error messages

        try {
            // Call the login API function from the auth.ts file
            const response = await loginUser(email, password);

            // Check if the login was successful
            if (response.status === 201) { // HttpStatus.CREATED is 201
                alert("Login successful!");
                // Redirect to dashboard or any other page after successful login
                window.location.href = '/dashboard'; // Example: Redirect to dashboard
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            // Handle error (e.g., invalid credentials)
            setErrorMessage("Invalid email or password.");
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
      <div className={styles['login-page']}>
          <div className={styles['login-background']}>
              <img src="/assets/logos/experion-logo.png" alt="Logo" />
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
                          <a href="#">Forgot Password?</a>
                      </div>
                      <button 
                          type="submit" 
                          className={styles['login-button']}
                          disabled={isLoading} // Disable button while loading
                      >
                          {isLoading ? "Logging in..." : "Login"}
                      </button>
                  </form>
                  {errorMessage && (
                      <div className={styles['login-error-message']}>
                          {errorMessage}
                      </div>
                  )}
              </div>
              <div className={styles['false-container']}></div>
          </div>
      </div>
    );
};

export default LoginPage;