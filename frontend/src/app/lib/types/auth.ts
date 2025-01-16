export interface LoginResponse {
    token: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    expiresIn?: number;
  }
  
  export interface AuthError {
    message: string;
    code?: string;
  }