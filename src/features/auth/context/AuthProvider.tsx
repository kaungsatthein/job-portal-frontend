"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logout } from "../services/auth";
import apiInstance from "@/lib/api-config/instance";

const ACCESS_TOKEN_KEY = (
  process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN || "access_token"
).trim();
const REFRESH_TOKEN_KEY = (
  process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN || "refresh_token"
).trim();
const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
).trim();

type AuthUser = Record<string, unknown> | null;

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  error: string | null;
  role: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window === "undefined") {
        setUser(null);
        return;
      }

      const token = cookieStore.get(ACCESS_TOKEN_KEY);
      if (!token) {
        setUser(null);
        return;
      }

      const res: any = await apiInstance.get(`${BASE_URL}/auth/me`);
      const userData = res?.data?.data ?? res?.data ?? null;
      console.log("res :>> ", res);
      setUser(userData);
    } catch (err: any) {
      setError(err?.response?.status === 401 ? null : "Unable to fetch user");
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
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      error,
      role: Array.isArray((user as any)?.role)
        ? ((user as any).role as string[])[0] ?? null
        : (user as any)?.role ?? null,
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
