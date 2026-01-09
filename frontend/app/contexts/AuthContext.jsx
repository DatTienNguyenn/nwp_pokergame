"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("pokerUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/home");
      }
    }
  }, [user, loading, pathname, router]);

  const login = (username, password) => {
    // Import and use authenticateUser from mockUsers
    const { authenticateUser } = require("../data/mockUsers");
    const authenticatedUser = authenticateUser(username, password);

    if (authenticatedUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = authenticatedUser;
      setUser(userWithoutPassword);
      localStorage.setItem("pokerUser", JSON.stringify(userWithoutPassword));
      router.push("/home");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pokerUser");
    router.push("/login");
  };

  const updateChips = (amount) => {
    setUser((prev) => {
      const updated = { ...prev, chips: prev.chips + amount };
      localStorage.setItem("pokerUser", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateChips, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
