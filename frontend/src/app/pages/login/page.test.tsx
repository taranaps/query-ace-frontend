'use client';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </AuthContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render email and password input fields', () => {
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toHaveAttribute('type', 'password');
  });

  it('should call login and redirect on valid credentials', async () => {
    mockLogin.mockResolvedValueOnce({});
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/pages/dashboard');
    });
  });

  it('should display an error message on invalid credentials', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password' }),
      } as Response)
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Error: Invalid email or password')).toBeInTheDocument();
    });
  });
});
