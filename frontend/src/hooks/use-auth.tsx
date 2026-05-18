"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "employee",
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("employee");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("atomquest-token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.get("/users/me");
      setUser(userData);
      setRole(userData.role as UserRole);
      localStorage.setItem("atomquest-role", userData.role);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("atomquest-token");
      localStorage.removeItem("atomquest-role");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (selectedRole: UserRole) => {
    try {
      // In a real app, this would take email/password.
      // For demo purposes, we map the selected role to our seeded test accounts.
      const credentials = {
        employee: { email: "employee@atomquest.com", password: "employee123" },
        manager: { email: "manager@atomquest.com", password: "manager123" },
        admin: { email: "admin@atomquest.com", password: "admin123" },
      };

      const loginData = credentials[selectedRole];
      const res = await api.post("/auth/login", loginData);
      
      localStorage.setItem("atomquest-token", res.access_token);
      localStorage.setItem("atomquest-role", res.role);
      
      await checkAuth(); // Fetch full user profile
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
      throw error;
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    setUser(null);
    setRole("employee");
    localStorage.removeItem("atomquest-token");
    localStorage.removeItem("atomquest-role");
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
