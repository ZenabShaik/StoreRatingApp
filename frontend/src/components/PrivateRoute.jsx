// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, allowed }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
