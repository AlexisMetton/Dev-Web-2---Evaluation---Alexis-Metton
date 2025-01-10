import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authProvider/AuthProvider";
import LoadingSpinner from "@/components/loader/Loader";

function AuthGuard({ children }) {
  const { isAuthenticated, authChecked, checkAuthStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(!authChecked);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!authChecked) {
        await checkAuthStatus();
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [authChecked, checkAuthStatus]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default AuthGuard;
