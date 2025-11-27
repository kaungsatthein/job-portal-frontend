"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logout } from "../services/auth";

type AuthUser = Record<string, unknown> | null;

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("user :>> ", user);

  const fetchMe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        if (res.status !== 401) {
          const body = await res
            .json()
            .catch(() => ({ error: "Unable to fetch user" }));
          setError(body.error || "Unable to fetch user");
        }
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch /api/auth/me", err);
      setError("Unable to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const signOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      error,
      refreshUser: fetchMe,
      signOut,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
