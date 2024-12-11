"use client";
import React, { useState } from "react";

import './loginmodule.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <img src="/assets/logos/experion-logo.png" />
            </div>
            <div className="login-foreground">
                <div className="login-container">
                    <div className="login-container-avatar">
                        <img src="/assets/icons/login-avatar.png" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
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
                        <div className="login-form-group">
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
                        <div className="login-container-forgot-password">
                            <a>Forgot Password ?</a>

                        </div>
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                </div>
                <div className="false-container"></div>
            </div>
        </div>
    );
};

export default LoginPage;

