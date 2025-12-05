import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { refreshAccessToken } from "@/services/admin/authService";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Helper to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    // Add 30 second buffer before actual expiration
    return Date.now() >= (exp - 30000);
  } catch {
    return true; // If we can't decode, consider it expired
  }
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  }, []);

  const validateAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      // Try to refresh the token
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        setIsAuthenticated(true);
      } else {
        // Refresh failed, logout
        logout();
      }
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    validateAndRefreshToken();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for forced logout (token refresh failed from API calls)
    const handleForceLogout = () => {
      logout();
    };
    window.addEventListener("auth:logout", handleForceLogout);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:logout", handleForceLogout);
    };
  }, [validateAndRefreshToken, logout]);

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, logout, setAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
