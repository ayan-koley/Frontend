import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function PublicRoute({children}) {
    const { isAuthenticated } = useAuth();

    if(isAuthenticated) return <Navigate to="/dashboard" replace />

    return children
}