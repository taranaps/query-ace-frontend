"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const token = params?.token;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid URL: Token is missing.");
      setIsTokenValid(false);
      return;
    }

    const validateToken = async() => {
      setLoading(true);
      try {
        const response = await fetch(`/api/auth/reset-password/${token}`, { method: "GET" });
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setMessage(data.message || "Invalid or expired token.");
          setIsTokenValid(false);
        }
      } catch {
        setLoading(false);
        setMessage("Error validating token.");
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, confirmNewPassword: confirmPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Password reset successful.");
        setTimeout(() => router.push("/pages/login"), 3000);
      } else {
        setMessage(data.message || "Error resetting password.");
      }
    } catch {
      setLoading(false);
      setMessage("An error occurred while resetting the password.");
    }
  };

  if (isTokenValid === null) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reset Password</h1>
      {isTokenValid ? (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <p style={{ color: "red" }}>{message}</p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
