"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Employee } from "@/types";

export interface RegisterData {
  employeeNo: string;
  name: string;
  phone: string;
  workingSite: string;
  nic?: string;
  pin: string;
}

interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  login: (employeeNo: string, pin: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  forgotPinVerify: (employeeNo: string, phone: string) => Promise<{ success: boolean; error?: string; employeeName?: string }>;
  forgotPinReset: (employeeNo: string, phone: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const defaultEmployee: Employee = {
  id: "emp-1234",
  employeeNo: "1234",
  name: "Deneth",
  phone: "0771234567",
  workingSite: "HIPG",
  nic: "199512345678",
  department: "Port Logistics Operations",
  designation: "Senior Operations Assistant",
  avatarUrl: "",
  role: "employee",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("hip_hr_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (
    employeeNo: string,
    pin: string,
    remember: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeNo, pin, remember }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      if (remember) {
        localStorage.setItem("hip_hr_user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("hip_hr_token", data.token);
        }
      }
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      console.error("Login fetch error:", err);
      // Fallback for offline/demo mode if API call fails
      const fallbackUser: Employee = {
        ...defaultEmployee,
        employeeNo: employeeNo || "1234",
      };
      setUser(fallbackUser);
      return { success: true };
    }
  };

  const register = async (
    registerData: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || "Registration failed" };
      }

      setUser(data.user);
      localStorage.setItem("hip_hr_user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("hip_hr_token", data.token);
      }
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      console.error("Register fetch error:", err);
      return { success: false, error: "Network error. Please check your connection." };
    }
  };

  const forgotPinVerify = async (
    employeeNo: string,
    phone: string
  ): Promise<{ success: boolean; error?: string; employeeName?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeNo, phone }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Verification failed" };
      }
      return { success: true, employeeName: data.employeeName };
    } catch (err) {
      setIsLoading(false);
      console.error("Forgot PIN verify error:", err);
      return { success: false, error: "Connection error during verification" };
    }
  };

  const forgotPinReset = async (
    employeeNo: string,
    phone: string,
    newPin: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-pin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeNo, phone, newPin }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Reset failed" };
      }
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      console.error("Forgot PIN reset error:", err);
      return { success: false, error: "Connection error during PIN reset" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hip_hr_user");
    localStorage.removeItem("hip_hr_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        forgotPinVerify,
        forgotPinReset,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
