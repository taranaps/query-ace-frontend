
export const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; 
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  };