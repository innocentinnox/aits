"use client";
import { authService } from "@/services";
import { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import FullWindowLoader from "@/components/loaders/full-window-loader";
import { toast } from "sonner";

export type Role = "student" | "lecturer" | "department_head" | "registrar";
export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  college: { id: number; name: string; code: string } | null;
  school: { id: number; name: string; code: string } | null;
  department: { id: number; name: string; code: string } | null;
  course: { id: number; name: string; code: string } | null;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  student_number: string | null;
  registration_number: string | null;
}
interface AuthContextProps {
  user: User | null;
  checkAuthStatus: () => Promise<void>;
  login: (
    credentials: any
  ) => Promise<Awaited<ReturnType<typeof authService.login>>>;
  logout: (redirect?: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = (path: string) => (window.location.href = path);
  console.log("user: ", user);
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const { data } = await authService.checkAuthStatus();
      if (data?.isAuthenticated && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const data = await authService.login(credentials);
      if (data.user?.id) {
        await checkAuthStatus();
      }
      return data;
    } catch (error: any) {
      throw new Error(error?.message || "Something went wrong");
    }
  };

  const logout = async (redirect?: string) => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
      navigate(redirect || DEFAULT_LOGOUT_REDIRECT);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    checkAuthStatus(); // check auth status on initial load
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, checkAuthStatus, login, logout, loading }}
    >
      {loading ? <FullWindowLoader /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
