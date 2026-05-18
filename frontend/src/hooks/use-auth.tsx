"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (roleOrEmail: UserRole | string, password?: string) => Promise<void>;
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

// Demo credentials mapped by role
const DEMO_CREDENTIALS: Record<string, { email: string; password: string }> = {
  employee: { email: "employee@atomquest.com", password: "employee123" },
  manager: { email: "manager@atomquest.com", password: "manager123" },
  admin: { email: "admin@atomquest.com", password: "admin123" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("employee");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const userData = await api.get("/users/me");
      setUser(userData);
      setRole(userData.role as UserRole);
      localStorage.setItem("atomquest-role", userData.role);
      return userData;
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("atomquest-token");
      localStorage.removeItem("atomquest-role");
      setUser(null);
      return null;
    }
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("atomquest-token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchProfile().finally(() => setIsLoading(false));
  }, [fetchProfile]);

  const login = useCallback(async (roleOrEmail: UserRole | string, password?: string) => {
    let email: string;
    let pwd: string;

    // If password is provided, treat first arg as email (form login)
    if (password) {
      email = roleOrEmail;
      pwd = password;
    } else {
      // Demo login — first arg is a role key
      const creds = DEMO_CREDENTIALS[roleOrEmail];
      if (!creds) {
        toast.error("Invalid demo role");
        throw new Error("Invalid demo role");
      }
      email = creds.email;
      pwd = creds.password;
    }

    console.log("[Auth] Attempting login for:", email);

    const res = await api.post("/auth/login", { email, password: pwd });
    console.log("[Auth] Login response:", res);

    if (!res?.access_token) {
      toast.error("Login failed — no token received");
      throw new Error("No access_token in response");
    }

    localStorage.setItem("atomquest-token", res.access_token);
    localStorage.setItem("atomquest-role", res.role);

    // Fetch full user profile
    const userData = await fetchProfile();
    if (userData) {
      toast.success(`Welcome, ${userData.name}!`);
    }
  }, [fetchProfile]);

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
