import { Navigate } from "react-router-dom";
import { useAuth } from "@/security/authProvider/AuthProvider";

function RoleGuard({ children, allowedRoles }) {
  const { roles, authChecked } = useAuth();

  if (!authChecked) {
    return null;
  }

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  return hasAccess ? children : <Navigate to="/" />;
}

export default RoleGuard;
