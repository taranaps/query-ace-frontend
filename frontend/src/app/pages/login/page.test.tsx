import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import LoginPage from "./page";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeAll(() => {
  global.alert = jest.fn();
});

describe("LoginPage", () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockPush = jest.fn();
  const mockToken = "fakeToken";

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // render(
    //   <AuthContext.Provider value={{ login: mockLogin, logout: mockLogout, token: mockToken }}>
    //     <LoginPage />
    //   </AuthContext.Provider>
    // );
  });

  test("renders login form correctly", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("handles form submission and redirects on success", async() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async() => ({ data: { token: "fakeToken" } }),
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ token: "fakeToken" }));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  test("shows an alert if login fails", async() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async() => ({ message: "Invalid credentials" }),
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error: Invalid credentials"));
  });

  test("handles error if fetch fails", async() => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith("An error occurred. Please try again.")
    );
  });
});
