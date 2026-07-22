"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Employee } from "@/types";

interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  login: (employeeNo: string, pin: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const defaultEmployee: Employee = {
  id: "emp-1234",
  employeeNo: "HMPT-1234",
  name: "Deneth",
  phone: "+94 77 123 4567",
  department: "Port Logistics Operations",
  designation: "Senior Operations Assistant",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  role: "employee",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(defaultEmployee);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("hip_hr_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(defaultEmployee);
      }
    }
  }, []);

  const login = async (employeeNo: string, pin: string, remember: boolean): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API authentication check
    await new Promise((resolve) => setTimeout(resolve, 800));

    const loggedUser: Employee = {
      ...defaultEmployee,
      employeeNo: employeeNo.toUpperCase() || "HMPT-1234",
    };

    setUser(loggedUser);
    if (remember) {
      localStorage.setItem("hip_hr_user", JSON.stringify(loggedUser));
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hip_hr_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
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
