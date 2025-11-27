"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
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

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  provider: string;
  role: string[] | string;
  loginCount: number;
  resumeUrl: string;
  jobPosts?: Array<{
    id: string;
    companyId: string | null;
    title: string;
    description: string;
    jobType: string;
    location: string;
    salaryRange: string;
    status: string;
    createdAt: string;
    company?: { name?: string } | null;
    applications?: Array<{
      id: string;
      researcherId: string;
      status: string;
      createdAt: string;
      researcher?: {
        name?: string;
        headline?: string;
        experience?: string;
      };
    }>;
  }>;
  applications?: Array<{
    id: string;
    jobId: string;
    status: string;
    createdAt: string;
    job?: {
      id: string;
      title?: string;
      description?: string;
      jobType?: string;
      location?: string;
      salaryRange?: string;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
      company?: { name?: string; industryId?: string } | null;
      recruiter?: { name?: string } | null;
    } | null;
  }>;
  savedJobs?: Array<{
    id: string;
    jobId: string;
    createdAt: string;
    job?: {
      id: string;
      title: string;
      description: string;
      jobType: string;
      location: string;
      salaryRange: string;
      status: string;
      createdAt: string;
      company?: { name?: string; industryId?: string } | null;
      recruiter?: { name?: string } | null;
    };
  }>;
} | null;

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  error: string | null;
  role: string | null;
  isFirstLogin: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  /**
   * 🟦 STABLE fetchMe with useCallback
   */
  const fetchMe = useCallback(async () => {
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

      setUser(userData);
      setIsFirstLogin(userData?.loginCount === 1);
    } catch (err: any) {
      setError(err?.response?.status === 401 ? null : "Unable to fetch user");
      setUser(null);
      setIsFirstLogin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  /**
   * 🟥 STABLE signOut with useCallback
   */
  const signOut = useCallback(async () => {
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

      window.location.href = "/";
    }
  }, []);

  /**
   * 🟩 Memoized context value
   * Only recalculates when dependencies change.
   */
  const value = useMemo<AuthContextValue>(() => {
    const extractedRole = Array.isArray(user?.role)
      ? user.role[0] ?? null
      : user?.role ?? null;

    return {
      user,
      isLoading,
      error,
      isFirstLogin,
      role: extractedRole,
      refreshUser: fetchMe,
      signOut,
    };
  }, [user, isLoading, error, isFirstLogin, fetchMe, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
