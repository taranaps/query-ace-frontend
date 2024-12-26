import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page"; // Adjust the import path as necessary
import '@testing-library/jest-dom';



describe("LoginPage Component", () => {
  test("renders login page with email and password fields", () => {
    render(<LoginPage />);

    // Check if email input is rendered
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toBeInTheDocument();

    // Check if password input is rendered
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toBeInTheDocument();

    // Check if the login button is rendered
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    // Check if the forgot password link is rendered
    const forgotPasswordLink = screen.getByText(/Forgot Password\?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  test("handles email and password input changes", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    // Simulate typing into the email input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");

    // Simulate typing into the password input
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits the form successfully", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Mock the console.log
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Check if console.log was called with correct arguments
    expect(consoleSpy).toHaveBeenCalledWith(
      "Email:",
      "test@example.com",
      "Password:",
      "password123"
    );

    // Cleanup console mock
    consoleSpy.mockRestore();
  });
});
