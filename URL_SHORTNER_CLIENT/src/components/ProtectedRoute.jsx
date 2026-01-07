import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  console.log("Dashboard is authenticated ", isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
