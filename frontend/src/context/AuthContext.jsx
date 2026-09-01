// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("cms_user");
    const token = localStorage.getItem("cms_token");
    if (raw && token) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("cms_user");
        localStorage.removeItem("cms_token");
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    localStorage.setItem("cms_token", token);
    localStorage.setItem("cms_user", JSON.stringify(user));
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
