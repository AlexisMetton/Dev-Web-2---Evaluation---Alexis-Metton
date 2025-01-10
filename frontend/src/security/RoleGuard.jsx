import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/security/authProvider/AuthProvider";
import LoadingSpinner from "@/components/loader/Loader";

function RoleGuard({ children, allowedRoles }) {
  const { roles, authChecked, checkAuthStatus } = useAuth();
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

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  return hasAccess ? children : <Navigate to="/" />;
}

export default RoleGuard;
