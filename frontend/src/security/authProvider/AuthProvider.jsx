import { createContext, useContext, useState, useEffect } from "react";
import API_URL from "@/utils/ConfiAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(true);
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
        setAuthChecked(true);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setAuthChecked(true);
        return false;
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(true);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, roles: user?.roles || [], authChecked, checkAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
