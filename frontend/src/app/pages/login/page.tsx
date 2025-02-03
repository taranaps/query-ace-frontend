"use client";

/**
 * @file LoginPage.tsx
 * @description A functional component for handling user login. It includes a form for email and password,
 * validates user credentials via an API, displays animated toast notifications for success/error states,
 * and redirects to the dashboard upon successful login.
 */

import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * Interface for the form data state
 * @interface
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 */

interface FormData {
    email: string;
    password: string;
}

/**
 * LoginPage component renders the login form and handles user authentication.
 * Includes toast notifications for success/error states and loading indicators.
 *
 * @component
 * @returns {JSX.Element} The rendered login page
 */
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const showSuccessToast = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 pt-0.5">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                                Login Successful
              </p>
              <p className="mt-1 text-sm text-gray-500">
                                Welcome back! Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>

      </div>
    ), {
      duration: 2000,
      position:"top-right",
    });
  };

  const showErrorToast = (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 pt-0.5">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                                Login Failed
              </p>
              <p className="mt-1 text-sm text-gray-500">
                                Invalid email or password
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
          >
                        Close
          </button>
        </div>
      </div>
    ), {
      duration: 2000,
      position: "top-right",
    });
  };

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

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        showSuccessToast();
        setTimeout(() => {
          router.push("/pages/dashboard");
        }, 2000);
      } else {
        showErrorToast(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showErrorToast("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-background"]}>
        <img src="/assets/logos/experion-logo.png" alt="Experion Logo" />
      </div>
      <div className={styles["login-foreground"]}>
        <div className={styles["login-container"]}>
          <div className={styles["login-container-avatar"]}>
            <img src="/assets/icons/login-avatar.png" alt="Login Avatar" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles["login-form-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div className={styles["login-form-group"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            <div className={styles["login-container-forgot-password"]}>
              <a href="#" tabIndex={isLoading ? -1 : 0}>Forgot Password?</a>
            </div>
            <button
              type="submit"
              className={`${styles["login-button"]} relative`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
        <div className={styles["false-container"]}></div>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            padding: "16px",
            borderRadius: "8px",
            background: "#fff",
            color: "#363636",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      />
    </div>
  );
};

export default LoginPage;
