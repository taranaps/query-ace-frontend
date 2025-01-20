"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`/api/auth/request-password-reset?email=${email}`, {
      method: "POST",
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setMessage("Password reset link sent to your email.");
      setTimeout(() => {
        router.push("/pages/login"); // Redirect to the login page
      }, 3000); // Optional delay before redirection
    } else {
      setMessage("Error: " + data.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit" disabled={loading}>Submit</button>
      </form>
      {loading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
