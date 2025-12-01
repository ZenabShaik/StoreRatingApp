// src/context/AuthContext.js
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [email, setEmail] = useState(() => localStorage.getItem("email") || null);

  // ---- LOGIN ----
  const login = (jwtToken, userRole, userEmail) => {
    setToken(jwtToken);
    setRole(userRole);
    setEmail(userEmail);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", userEmail);
  };

  // ---- LOGOUT ----
  const logout = () => {
    setToken(null);
    setRole(null);
    setEmail(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  // convenient object for components
  const user = role ? { role, email } : null;

  return (
    <AuthContext.Provider value={{ token, role, email, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook used everywhere
export const useAuth = () => useContext(AuthContext);
