import axios from "axios";
import { LoginResponse, AuthError } from "./types/auth";
import { API_BASE_URL } from "@/config/apiConfig";

export const login = async(email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { email, password }
    );

    if (response.data.token) {
      setAuthData(response.data);
    }

    return response.data;
  } catch (error: any) {
    const authError: AuthError = {
      message: error.response?.data?.message || "Invalid email or password",
      code: error.response?.status?.toString()
    };
    throw authError;
  }
};

export const setAuthData = (authResult: LoginResponse): void => {
  if (typeof window !== "undefined") {
    if (authResult.expiresIn) {
      const expiresAt = new Date().getTime() + authResult.expiresIn * 1000;
      localStorage.setItem("expires_at", expiresAt.toString());
    }
    localStorage.setItem("token", authResult.token);
    localStorage.setItem("role", authResult.role);
  }
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expires_at");
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");
    return !!token && (!expiresAt || new Date().getTime() < parseInt(expiresAt));
  }
  return false;
};

export const getRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};
